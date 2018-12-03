class Require extends HTMLElement
{
    constructor()
    {
        super();
        this.set_require_behavoiur();

        this.module_tree   = [];
        this.node_index    = {};
        this.index_counter = 1;
    }

    set_require_behavoiur()
    {
        if(Require.is_requirejs_available())
        {
            this.require = requirejs;
            this.require_config = requirejs.config;
        } else {
            window.register_module = this.register_module.bind(window, this);
        }

    }

    require(module_array, cb)
    {
        let parent = {deps: [], cb: cb, deps_to_load: module_array.length, index_tree: this.module_tree.length/*, parent: null*/};
        this.module_tree.push(parent);

        this.add_modules(module_array, parent);
    }


    add_modules(module_array, parent)
    {
        for(let i=0; i<module_array.length; i++)
        {
            let js_node = document.createElement('script');

            js_node.setAttribute("type",  "text/javascript");
            js_node.setAttribute("src",   module_array[i]);
            js_node.setAttribute("index", "@." + this.index_counter);

            this.shadow_root.appendChild(js_node);

            let node = {deps: [], cb: null, index_tree: parent.index_tree /*, deps_to_load: 0, parent:parent*/};
            parent.deps.push(node);

            this.node_index["@." + this.index_counter] = node;
            this.index_counter++;

            js_node.onload = (e) =>
            {
                if(--this.module_tree[node.index_tree].deps_to_load === 0)
                    this.load_all(this.module_tree[node.index_tree]);
                //console.log('load ' + this.module_tree[node.index_tree].deps_to_load);
            };
        }
    }

    register_module(context, dependence_array, module)
    {
        context.node_index[this.document.currentScript.attributes['index'].value].cb                                            = module;
        context.module_tree[context.node_index[this.document.currentScript.attributes['index'].value].index_tree].deps_to_load += dependence_array.length;

        //console.log('DEFINE ' + context.module_tree[context.node_index[this.document.currentScript.attributes['index'].value].index_tree].deps_to_load);

        if(dependence_array.length)
            context.add_modules(dependence_array, context.node_index[this.document.currentScript.attributes['index'].value]);
    }

    check(node)
    {
        if(node.parent === null && node.deps_to_load === 0) {
            console.log('load all');
            this.load_all(node);
            return
        }

        node.parent.deps_to_load--;

        if(node.parent.deps_to_load === 0)
            this.check(node.parent);
    }

    load_all(node)
    {
        let deps = node.deps.map((e)=>{
            return this.load_all(e);
        });

        return node.cb(...deps);
    }

    //Static
    static is_requirejs_available()
    {
        return (typeof define === 'function' && define.amd)
    }

}