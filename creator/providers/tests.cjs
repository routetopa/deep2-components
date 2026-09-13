const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
async function run() {
    let fetchImpl;
    const context = vm.createContext({URL, Blob, fetch: (...args) => fetchImpl(...args), ZenodoAPI: {MAX_BYTES: 50 * 1024 * 1024}});
    vm.runInContext(fs.readFileSync(__dirname + '/provider-api.js', 'utf8'), context);
    const api = context.CreatorProviderAPI;
    const plain = value => JSON.parse(JSON.stringify(value));
    assert.deepEqual(plain(api.ckanLocation('https://example.org/catalog/dataset/my-data/resource/abc')), {base: 'https://example.org/catalog', dataset: 'my-data'});
    assert.deepEqual(plain(api.ckanLocation('https://example.org/catalog/api/3/action/package_search')), {base: 'https://example.org/catalog', dataset: null});
    assert.throws(() => api.ckanLocation('file:///secret'));
    assert.throws(() => api.ckanLocation('https://user:password@example.org'));
    const calls = [];
    const signal = new AbortController().signal;
    const packages = [
        {title: 'First', name: 'first', notes: 'Dataset description', license_title: 'CC BY', organization: {title: 'Test publisher'}, resources: [{id: 'a', name: 'CSV', format: 'CSV', url: 'https://files.example/a.csv'}]},
        {title: 'Second', resources: [{id: 'b', name: 'Table', datastore_active: true}, {id: 'c', format: 'PDF', url: 'https://example.org/c.pdf'}]}
    ];
    fetchImpl = async url => {
        calls.push(new URL(url));
        const start = Number(new URL(url).searchParams.get('start'));
        return Response.json({success: true, result: {count: 2, results: [packages[start]]}});
    };
    const files = await api.ckan('https://example.org/catalog/', signal);
    assert.equal(files.length, 2);
    assert.equal(calls[1].searchParams.get('start'), '1');
    assert.equal(files[0].csv, true);
    assert.equal(files[0].metadata.description, 'Dataset description');
    assert.equal(files[0].metadata.publisher, 'Test publisher');
    assert.equal(files[0].metadata.license, 'CC BY');
    assert.equal(files[0].metadata.recordUrl, 'https://example.org/catalog/dataset/first');
    context.ZenodoAPI.csvFiles = () => [{name: 'data.csv', url: 'https://zenodo.org/data.csv'}];
    const zenodo = api.zenodoFiles({id: 123, doi: '10.5281/zenodo.123', metadata: {
        title: 'Research data', description: '<p>Description</p>', creators: [{name: 'Author'}],
        license: {id: 'cc-by-4.0'}, keywords: ['data', 'research']
    }})[0];
    assert.equal(zenodo.metadata.title, 'Research data');
    assert.equal(zenodo.metadata.authors, 'Author');
    assert.equal(zenodo.metadata.license, 'cc-by-4.0');
    assert.equal(zenodo.metadata.recordUrl, 'https://zenodo.org/records/123');
    assert.equal(api.zenodoFiles({id: 124})[0].metadata.publisher, 'Zenodo');
    assert.equal(files[1].url, 'https://example.org/catalog/api/3/action/datastore_search?resource_id=b');
    fetchImpl = async url => {
        assert.equal(new URL(url).searchParams.get('id'), 'my-data');
        return Response.json({success: true, result: packages[0]});
    };
    assert.equal((await api.ckan('https://example.org/dataset/my-data', signal)).length, 1);
    fetchImpl = async url => {
        const offset = Number(new URL(url).searchParams.get('offset'));
        return Response.json({success: true, result: {total: 2, records: [{id: offset + 1}]}});
    };
    assert.deepEqual(plain(await api.datastore(files[1], signal)), [{id: 1}, {id: 2}]);
    fetchImpl = async () => Response.json({success: false});
    await assert.rejects(api.ckan('https://example.org', signal), /valid CKAN/);
    fetchImpl = async () => { throw Error('CORS'); };
    await assert.rejects(api.ckan('https://example.org', signal), /CORS/);

    // Switching providers during a download must not deliver stale rows.
    let finish;
    const behaviorContext = vm.createContext({AbortController, setTimeout, clearTimeout,
        CreatorProviderAPI: {csv: () => new Promise(resolve => { finish = resolve; })}});
    vm.runInContext(fs.readFileSync(__dirname + '/provider-behavior.js', 'utf8'), behaviorContext);
    const behavior = behaviorContext.CreatorProviderBehavior;
    const events = [];
    Object.assign(behavior, {_showProviderMetadata() {}, _providerFiles: [{url: 'https://example.org/a.csv', csv: true}], fire: (...args) => events.push(args)});
    const pending = behavior._loadProviderFile('https://example.org/a.csv');
    behavior._cancelProviderRequest();
    finish([{name: 'old'}]);
    await pending;
    assert.equal(events.some(event => event[0] === 'provider-data'), false);
    return 'CKAN discovery, pagination, resource selection, errors and cancellation checks passed.';
}
module.exports = run;
if (require.main === module) run().then(console.log).catch(error => { console.error(error); process.exitCode = 1; });
