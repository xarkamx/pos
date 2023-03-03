
export class Templates {
    /**
     * @param {DOM} parentDom
     * @param {DOM} templateDom
     * @param {object||array||json} data
     * @param {object} specialEvents permite customizar la impresion de un argumento
     * por la clase de su DOM, por ejemplo si la clase de tu Dom objetivo es
     * .titulo, tu metodo dentro de specialEvents deberia ser titulo(dom,value);
     * 
     */
    fillTemplate(parentDom, templateDom, data, specialEvents = {}) {
        if (parentDom === null) {
            parentDom = document.body;
        }
        if (templateDom === null) {
            templateDom = document.body;
        }
        if (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (!Array.isArray(data)) {
            data = [data];
        }
        for (let pos = 0; pos < data.length; ++pos) {
            let item = data[pos];
            let clone = templateDom.cloneNode(true);
            this.currentItem = item;
            this.setTemplateContent(item, clone, specialEvents);
            parentDom.appendChild(clone);
        }
        templateDom.remove();
    }
    setTemplateContent(items, dom, sp) {
        for (let key in items) {
            let item = items[key];
            let doms = this.validDomChild(dom, key);
            if (doms === false) {

                continue;
            }
            for (let index = 0; index < doms.length; ++index) {
                this.fillDom(doms[index], key, item, sp);
            }
        }
        return dom;
    }
    fillDom(dom, key, value, sp) {
        if (sp[key] !== undefined && typeof sp[key] === "function") {
            return sp[key](dom, value, this.currentItem);
        }
        if (this[dom.tagName] === undefined) {
            (dom.value === undefined) ? dom.innerHTML = value : dom.value = value;
            return dom;
        }
        else {
            this[dom.tagName](dom, value);
            return dom;
        }
    }
    validDomChild(dom, key) {
        let doms = dom.querySelectorAll('.' + key) ||
            dom.querySelectorAll('#' + key) ||
            dom.querySelectorAll("input['name=" + key + "']");
        return (doms.length > 0) ? doms : false;
    }
    /**
     *@param {object} json {label,name}
     *@param {DOM} targetNode
     */
    printForm(json, tn, specialEvents = {}) {
        if (typeof json !== 'object') {
            json = JSON.parse(json);
        }
        for (let pos in json) {
            let item = json[pos];
            let parent = document.createElement('div');
            let label = document.createElement('label');
            label.classList.add('control-label');
            label.classList.add('col-md-4');
            parent.classList.add("form-group");
            parent.classList.add(item.name);
            label.innerHTML = item.label;
            parent.appendChild(label);
            parent.appendChild(this.setInput(item));
            if (specialEvents[pos] !== undefined) {
                specialEvents[pos](parent);
            }
            tn.appendChild(parent);
        }
    }
    /**
     *@param {object} data 
     *@param {DOM} targetNode
     */
    fillForm(data, form, sp = {}, autoChange = true) {
        if (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (Array.isArray(data)) {
            data = data[data.length - 1];
        }
        let inputs = form.querySelectorAll('input, select, textarea');
        for (let index = 0; index < inputs.length; ++index) {
            let input = inputs[index];
            let name = input.name;
            if (sp[name] !== undefined) {
                sp[name](input, data[name]);
                continue;
            }
            if (input.type === 'radio') {
                input.checked = (input.value.toLowerCase() === `${data[name]}`.toLowerCase());
                continue;
            }
            if (input.type === "file") {
                continue;
            }

            input.value = data[name] || input.value;
            if (data[name] && autoChange === true) {
                var event = new Event('change');
                input.dispatchEvent(event);
            }
        }
    }
    formOnError(data, form) {
        if (data.error === undefined) {
            return false;
        }
        data = data.error;
        if (data.alert !== undefined) {
            alert(data.alert);
        }
        if (typeof data !== 'object') {
            data = JSON.parse(data);
        }
        if (Array.isArray(data)) {
            data = data[data.length - 1];
        }
        let inputs = form.querySelectorAll('input,select,textarea');
        for (let index = 0; index < inputs.length; ++index) {
            let input = inputs[index];
            let name = input.name;
            if (data[name] === undefined) {
                continue;
            }

            input.placeholder = data[name];
            input.classList.add('error');
            input.value = "";
        }
    }
    setInput(input) {
        let customInput = this[input.type];
        let divContainer = document.createElement('div');
        let generatedInput = document.createElement('input');
        generatedInput.classList.add('form-control');
        divContainer.classList.add('col-md-8');
        if (customInput !== undefined) {
            generatedInput = customInput(input);
        }
        for (let pos in input) {
            let att = input[pos];
            if (generatedInput.isReadOnly(pos)) continue;
            generatedInput[pos] = att;
        }
        divContainer.appendChild(generatedInput);
        return divContainer;
    }
    select(input) {
        let sel = document.createElement('select');
        for (let pos in input.options) {
            let item = input.options[pos];
            let option = document.createElement('option');
            option.value = item;
            option.innerHTML = item;
            sel.add(option);
        }
        return sel;
    }
    textarea(input) {
        let textareaDOM = document.createElement('textarea');
        textareaDOM.value = input.value;
        return textareaDOM;
    }
    IMG(input, value) {
        input.src = value;
    }
    jsonToMenu(json, target, sp = {}) {
        let mTarget = target.cloneNode(true);
        let parent = target.parentNode;
        for (let pos in json) {
            let menu = json[pos];
            let clone = mTarget.cloneNode(true);
            this.fillMenu(pos, menu, clone, sp);
            parent.appendChild(clone);
        }
        target.remove();
        return mTarget;
    }
    fillMenu(name, menu, dom, sp = this) {
        menu.name = name;
        if (menu['childs'] === undefined) {
            dom.querySelector('.submenu').remove();
            dom.querySelector('.arrow').remove();
        }
        for (let index in menu) {
            let element = menu[index];
            let item = dom.querySelector('.' + index);
            if (item === null) {
                continue;
            }
            index = index.replace(/-/gi, '_');
            if (typeof sp[index] === 'function') {
                sp[index](item, element);
                continue;
            }
            item.innerHTML = element;
        }
    }
    addChildToTemplate(targetNode, data, singularity) {
        let clone = targetNode.cloneNode(true);
        let parent = targetNode.parentElement;
        let childs = parent.innerHTML;
        parent.innerHTML = '';
        parent.appendChild(clone);
        this.fillTemplate(parent, clone, data, singularity);
        parent.insertAdjacentHTML('beforeEnd', childs);
    }
    quickFill(targetNode, data, singularity = {}) {
        this.setTemplateContent(data, targetNode, singularity);
    }
    addToSelect(select, name, value) {
        let option = document.createElement('option');
        option.innerHTML = name;
        option.value = value;
        select.add(option);
    }
    addMultipleOptionsToSelect(select, args) {
        select.innerHTML = '';
        for (let key in args) {
            this.addToSelect(select, args[key], key);
        }
    }
    loadTemplate(dom, target) {
        target.innerHTML = "";
        target.insertAdjacentHTML('beforeEnd', dom.innerHTML);
        return target;
    }
    loadBeforeTemplate(dom, target) {
        target.insertAdjacentHTML('afterBegin', dom.innerHTML);
        return target;
    }
    jsonToList(object, alias, ignore = 'id', sp = {}) {
        let ul = document.createElement('ul');
        let li = document.createElement('li');
        li.classList.add('list-group-item');
        alias = this.fillAlias(alias, Object.keys(object));
        if (typeof object === "string") {
            li.innerHTML = "<strong>" + object + "</strong>";
            ul.appendChild(li);
            return ul;
        }
        for (let key in alias) {
            let item = object[key];
            let apodo = alias[key];
            let skip = ignore.search(key);
            if (skip !== -1 || item === undefined) {
                continue;
            }
            if (typeof item === "object") {
                let childUl = this.jsonToList(item, alias, ignore, sp);
                ul.appendChild(childUl);
                continue;
            }
            try {
                if (isNaN(item)) {
                    item = JSON.parse(item);
                    let childUl = this.jsonToList(item, alias, ignore, sp);
                    ul.appendChild(childUl);
                    continue;
                }
            } catch (e) {
            }
            let titles = this.splitOnUpperCase(key);
            if (apodo !== undefined) {
                titles = apodo;
            }

            li.innerHTML = "<strong>" + titles + ": </strong>" + item;
            let liclon = li.cloneNode(true);
            liclon.classList.add(key);
            ul.appendChild(liclon);

            if (typeof sp[key] === 'function') {
                sp[key](liclon, item, titles);

            }
        }
        return ul;
    }
    fillAlias(alias, objectKeys) {
        for (const key of objectKeys) {
            if (alias[key] === undefined) {
                alias[key] = key;
            }
        }
        return alias;
    }
    /**
     * Esta funcion permite rellenar multiples plantillas basados
     *  en un objeto que contiene multiples arreglos
     * 
     * @param {*} data 
     * @param {*} nodes 
     */
    multiFillTemplates(data, nodes) {
        for (let index = 0; index < nodes.length; ++index) {
            let node = nodes[index];
            let type = node.dataset.type;
            if (type === null || data[type] === undefined) {
                node.innerHTML = "datos indeterminados";
                continue;
            }
            this.quickFill(node, data[type]);
        }
    }
}
