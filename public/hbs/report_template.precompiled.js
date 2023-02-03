(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['report_template'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <li>\r\n                <b>Generator:</b> "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"generator") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"generator") : depth0)) != null ? lookupProperty(stack1,"docsURL") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":16},"end":{"line":13,"column":106}}})) != null ? stack1 : "")
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"generator") : depth0)) != null ? lookupProperty(stack1,"bugsURL") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":14,"column":16},"end":{"line":14,"column":106}}})) != null ? stack1 : "")
    + "\r\n            </li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "(<a href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"generator") : depth0)) != null ? lookupProperty(stack1,"docsURL") : stack1), depth0))
    + "\" target=\"_blank\">docs</a>)";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "(<a href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"generator") : depth0)) != null ? lookupProperty(stack1,"bugsURL") : stack1), depth0))
    + "\" target=\"_blank\">bugs</a>)";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <li><b>Generator:</b> "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"generator") : stack1), depth0))
    + "</li>\r\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"title") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":16},"end":{"line":20,"column":92}}})) != null ? stack1 : "")
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"author") : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":16},"end":{"line":21,"column":97}}})) != null ? stack1 : "")
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"license") : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":16},"end":{"line":22,"column":100}}})) != null ? stack1 : "")
    + "\r\n                "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"source") : stack1),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":16},"end":{"line":23,"column":97}}})) != null ? stack1 : "")
    + "\r\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li><b>Title:</b> "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"title") : stack1), depth0))
    + "</li>";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li><b>Author:</b> "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"author") : stack1), depth0)) != null ? stack1 : "")
    + "</li>";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li><b>License:</b> "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"license") : stack1), depth0)) != null ? stack1 : "")
    + "</li>";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li><b>Source:</b> "
    + ((stack1 = container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1)) != null ? lookupProperty(stack1,"source") : stack1), depth0)) != null ? stack1 : "")
    + "</li>";
},"17":function(container,depth0,helpers,partials,data) {
    return "None";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <ul>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extensionsUsed") : stack1),{"name":"each","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":16},"end":{"line":41,"column":25}}})) != null ? stack1 : "")
    + "                </ul>\r\n";
},"20":function(container,depth0,helpers,partials,data) {
    return "                    <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\r\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <table class=\"report-table\">\r\n        <thead>\r\n            <tr style=\"background: #f44336;\">\r\n            <th>Error</th>\r\n            <th>Message</th>\r\n            <th>Pointer</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"errors") : depth0),{"name":"each","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":62,"column":12},"end":{"line":68,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"messages") : stack1),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":69,"column":12},"end":{"line":71,"column":23}}})) != null ? stack1 : "")
    + "        </tbody>\r\n        </table>\r\n";
},"23":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <tr>\r\n            <td><code>"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":64,"column":22},"end":{"line":64,"column":30}}}) : helper)))
    + "</code></td>\r\n            <td>"
    + alias4(((helper = (helper = lookupProperty(helpers,"message") || (depth0 != null ? lookupProperty(depth0,"message") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data,"loc":{"start":{"line":65,"column":16},"end":{"line":65,"column":27}}}) : helper)))
    + "</td>\r\n            <td><code>"
    + alias4(((helper = (helper = lookupProperty(helpers,"pointer") || (depth0 != null ? lookupProperty(depth0,"pointer") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pointer","hash":{},"data":data,"loc":{"start":{"line":66,"column":22},"end":{"line":66,"column":33}}}) : helper)))
    + "</code></td>\r\n            </tr>\r\n";
},"25":function(container,depth0,helpers,partials,data) {
    return "            <tr><td colspan=\"3\">No issues found.</td></tr>\r\n";
},"27":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <table class=\"report-table\">\r\n        <thead>\r\n            <tr style=\"background: #f9a825;\">\r\n            <th>Warning</th>\r\n            <th>Message</th>\r\n            <th>Pointer</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"warnings") : depth0),{"name":"each","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":12},"end":{"line":91,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"messages") : stack1),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":92,"column":12},"end":{"line":94,"column":23}}})) != null ? stack1 : "")
    + "        </tbody>\r\n        </table>\r\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <table class=\"report-table\">\r\n        <thead>\r\n            <tr style=\"background: #8bc34a;\">\r\n            <th>Hint</th>\r\n            <th>Message</th>\r\n            <th>Pointer</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"hints") : depth0),{"name":"each","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":108,"column":12},"end":{"line":114,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"messages") : stack1),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":115,"column":12},"end":{"line":117,"column":23}}})) != null ? stack1 : "")
    + "        </tbody>\r\n        </table>\r\n";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <table class=\"report-table\">\r\n        <thead>\r\n            <tr style=\"background: #2196f3;\">\r\n            <th>Info</th>\r\n            <th>Message</th>\r\n            <th>Pointer</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"infos") : depth0),{"name":"each","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":131,"column":12},"end":{"line":137,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"messages") : stack1),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":138,"column":12},"end":{"line":140,"column":23}}})) != null ? stack1 : "")
    + "        </tbody>\r\n        </table>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<!DOCTYPE html>\r\n<title>glTF 2.0 validation report</title>\r\n<style>\r\n    body { overflow-y: auto; }\r\n</style>\r\n<div class=\"report\">\r\n    <h1>Validation report</h1>\r\n    <ul>\r\n        <li><b>Format:</b> glTF "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"version") : stack1), depth0))
    + "</li>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"generator") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":10,"column":12},"end":{"line":18,"column":19}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extras") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":19,"column":12},"end":{"line":24,"column":19}}})) != null ? stack1 : "")
    + "        <li>\r\n            <b>Stats:</b>\r\n            <ul>\r\n                <li>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"drawCallCount") : stack1), depth0))
    + " draw calls</li>\r\n                <li>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"animationCount") : stack1), depth0))
    + " animations</li>\r\n                <li>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"materialCount") : stack1), depth0))
    + " materials</li>\r\n                <li>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"totalVertexCount") : stack1), depth0))
    + " vertices</li>\r\n                <li>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"totalTriangleCount") : stack1), depth0))
    + " triangles</li>\r\n            </ul>\r\n        </li>\r\n        <li>\r\n            <b>Extensions:</b> "
    + ((stack1 = lookupProperty(helpers,"unless").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extensionsUsed") : stack1),{"name":"unless","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":31},"end":{"line":36,"column":77}}})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"info") : depth0)) != null ? lookupProperty(stack1,"extensionsUsed") : stack1),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":12},"end":{"line":43,"column":19}}})) != null ? stack1 : "")
    + "        </li>\r\n    </ul>\r\n    <hr/>\r\n    <p>\r\n        Report generated by\r\n        <a href=\"https://github.com/KhronosGroup/glTF-Validator/\">KhronosGroup/glTF-Validator</a>\r\n        "
    + alias2(((helper = (helper = lookupProperty(helpers,"validatorVersion") || (depth0 != null ? lookupProperty(depth0,"validatorVersion") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"validatorVersion","hash":{},"data":data,"loc":{"start":{"line":50,"column":8},"end":{"line":50,"column":28}}}) : helper)))
    + ".\r\n    </p>\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"numErrors") : stack1),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":4},"end":{"line":74,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"numWarnings") : stack1),{"name":"if","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":75,"column":4},"end":{"line":97,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"numHints") : stack1),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":98,"column":4},"end":{"line":120,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"issues") : depth0)) != null ? lookupProperty(stack1,"numInfos") : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":121,"column":4},"end":{"line":143,"column":11}}})) != null ? stack1 : "")
    + "</div>";
},"useData":true});
})();