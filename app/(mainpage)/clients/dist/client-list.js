"use strict";
exports.__esModule = true;
exports.ClientListHeader = exports.ClientList = void 0;
var button_1 = require("@/components/ui/button");
var link_1 = require("next/link");
exports.ClientList = function (_a) {
    var clients = _a.clients;
    return (React.createElement("ul", null, clients.map(function (client) { return (React.createElement("li", { key: client.id },
        React.createElement(link_1["default"], { href: "/clients/" + client.id }, client.name))); })));
};
exports.ClientListHeader = function () {
    return (React.createElement("div", { className: "flex justify-between items-center" },
        React.createElement("h2", { className: "text-lg font-medium mb-2" }, "Clients"),
        React.createElement(button_1.Button, { asChild: true },
            React.createElement(link_1["default"], { href: "/clients/new" }, "Create"))));
};
