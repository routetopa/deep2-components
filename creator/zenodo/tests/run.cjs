/* Run with: npm install && npm test (from this directory). */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

async function run(Papa) {
    let fetchImpl;
    const context = vm.createContext({URL, Blob, fetch: (...args) => fetchImpl(...args)});
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../zenodo-api.js'), 'utf8'), context);
    const api = context.ZenodoAPI;
    const plain = value => JSON.parse(JSON.stringify(value));
    assert.equal(api.normalizeDoi(' https://doi.org/10.5281/zenodo.123 '), '10.5281/zenodo.123');
    assert.equal(api.normalizeDoi('doi:10.5281/zenodo.123'), '10.5281/zenodo.123');
    assert.throws(() => api.normalizeDoi('https://example.org/123'), /Enter a DOI/);
    assert.deepEqual(plain(api.csvFiles({id: 123, files: [{key: 'a.CSV', size: 10}, {key: 'archive.zip'}]})),
        [{name: 'a.CSV', size: 10, url: 'https://zenodo.org/records/123/files/a.CSV?download=1'}]);
    assert.equal(api.csvFiles({files: {entries: {a: {key: 'a.csv', links: {content: 'https://zenodo.org/file'}}}}})[0].url, 'https://zenodo.org/file');
    assert.deepEqual(plain(api.csvFiles({})), []);
    assert.throws(() => api.csvFiles({files: [{key: 'a.csv', links: {self: 'https://other.example/file'}}]}), /unsupported/);
    assert.deepEqual(plain(api.parseCsv('\uFEFFname,value\n"a,b",2\n', Papa)), [{name: 'a,b', value: '2'}]);
    assert.deepEqual(plain(api.parseCsv('name;value\nA;2', Papa)), [{name: 'A', value: '2'}]);
    assert.deepEqual(plain(api.parseCsv('name\nA\nB', Papa)), [{name: 'A'}, {name: 'B'}]);
    for (const csv of ['', 'a,a\n1,2', 'a,\n1,2', 'a,b\n1,2,3', 'a,b', '<html>error</html>', '__proto__\nx', 'a,b\n"unclosed,2']) {
        assert.throws(() => api.parseCsv(csv, Papa), undefined, csv);
    }
    const calls = [];
    fetchImpl = async url => { calls.push(new URL(url)); return Response.json({hits: {hits: [{id: 123}]}}); };
    assert.equal((await api.findRecord('10.5281/zenodo.123')).id, 123);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].searchParams.get('all_versions'), 'true');
    assert.equal(calls[0].searchParams.get('q'), 'doi:"10.5281/zenodo.123"');
    let responses = [{hits: {hits: []}}, {hits: {hits: [{links: {latest: 'https://zenodo.org/api/records/456'}}]}}, {id: 456}];
    fetchImpl = async () => Response.json(responses.shift());
    assert.equal((await api.findRecord('10.5281/zenodo.123')).id, 456);
    fetchImpl = async () => Response.json({hits: {hits: []}});
    await assert.rejects(api.findRecord('10.5281/zenodo.123'), /No published/);
    for (const [status, message] of [[403, /restricted/], [404, /not found/], [429, /too many/]]) {
        fetchImpl = async () => new Response('', {status});
        await assert.rejects(api.findRecord('10.5281/zenodo.123'), message);
    }
    fetchImpl = async () => { throw Error('offline'); };
    await assert.rejects(api.findRecord('10.5281/zenodo.123'), /Could not reach/);
    const file = {url: 'https://zenodo.org/file', size: 10};
    fetchImpl = async () => new Response('name,value\nA,2');
    assert.deepEqual(plain(await api.loadCsv(file, undefined, Papa)), [{name: 'A', value: '2'}]);
    await assert.rejects(api.loadCsv({...file, size: api.MAX_BYTES + 1}, undefined, Papa), /50 MB/);
    fetchImpl = async () => new Response('', {headers: {'Content-Length': api.MAX_BYTES + 1}});
    await assert.rejects(api.loadCsv(file, undefined, Papa), /50 MB/);
    fetchImpl = async () => new Response(new Uint8Array(api.MAX_BYTES + 1));
    await assert.rejects(api.loadCsv(file, undefined, Papa), /50 MB/);

    // A cancelled CSV download must not advance or re-enable a stale selection.
    let component;
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../zenodo-controllet.js'), 'utf8'), {
        Polymer: value => { component = value; }, AbortController, setTimeout, clearTimeout,
        ZenodoAPI: {loadCsv: () => new Promise(resolve => { component.finishDownload = resolve; })}, Papa
    });
    let advanced = false;
    Object.assign(component, {_files: [file], _selectedFile: 0, _clearWorkflow() {}, _status() {},
        $: {use_csv: {disabled: false}, slider: {_onNextClick() { advanced = true; }}}});
    const pending = component._useCsv();
    component._cancelRequest();
    component.finishDownload([{name: 'A'}]);
    await pending;
    assert.equal(advanced, false);
    assert.equal(component.$.use_csv.disabled, true);
    // Non-JSON live responses must reject, allowing the existing cache fallback.
    const behavior = fs.readFileSync(path.join(__dirname, '../../../datalets/lib/modules/AjaxJsonAlasqlBehavior.js'), 'utf8');
    const requestSource = behavior.slice(behavior.indexOf('export const requestData'), behavior.indexOf('export const selectData')).replace('export const', 'var');
    let responseText = 'name,value\nA,2';
    const loader = vm.createContext({XMLHttpRequest: class {
        open() {} send() { this.readyState = 4; this.status = 200; this.responseText = responseText; this.onreadystatechange(); }
    }});
    vm.runInContext(requestSource, loader);
    await assert.rejects(loader.requestData('https://zenodo.org/file'));
    responseText = '[{"name":"A"}]';
    assert.deepEqual(plain(await loader.requestData('https://example.org/data')), [{name: 'A'}]);
    return 'Zenodo API, CSV validation, download limits and cancellation checks passed.';
}
module.exports = run;
if (require.main === module) run(require('papaparse')).then(console.log).catch(error => { console.error(error); process.exitCode = 1; });
