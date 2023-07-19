"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var auth_1 = require("@/lib/auth");
var prisma_1 = require("@/lib/prisma");
var cache_1 = require("next/cache");
var duration_1 = require("./duration");
var activity_item_1 = require("./activity-item");
var NewActivity = function (_a) {
    var activity = _a.activity;
    function startActivity(data) {
        'use server';
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth_1.getUserSession()];
                    case 1:
                        user = _a.sent();
                        console.log(user);
                        return [4 /*yield*/, prisma_1.prisma.activity.create({
                                data: {
                                    user: { connect: { id: user.id } },
                                    tenant: { connect: { id: user.tenant.id } },
                                    name: data.get('name'),
                                    startAt: new Date()
                                }
                            })];
                    case 2:
                        _a.sent();
                        cache_1.revalidatePath('/track');
                        return [2 /*return*/];
                }
            });
        });
    }
    function stopActivity(data) {
        'use server';
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.activity.update({
                            where: {
                                id: data.get('id')
                            },
                            data: {
                                endAt: new Date(),
                                name: data.get('name')
                            }
                        })];
                    case 1:
                        _a.sent();
                        cache_1.revalidatePath('/track');
                        return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", null,
        React.createElement("h2", null, "What are you working on ?"),
        React.createElement("form", { action: activity ? stopActivity : startActivity },
            React.createElement("div", { className: "flex items-center space-x-4" },
                React.createElement(input_1.Input, { name: "name", type: "text", defaultValue: (activity === null || activity === void 0 ? void 0 : activity.name) || '' }),
                React.createElement("input", { type: "hidden", name: "id", defaultValue: (activity === null || activity === void 0 ? void 0 : activity.id) || '' }),
                activity && (React.createElement(duration_1["default"], { startAt: activity.startAt })),
                React.createElement(button_1.Button, { type: "submit", value: "submit" }, activity ? 'Stop' : 'Start')))));
};
var DailyActivities = function (_a) {
    var activities = _a.activities;
    return (React.createElement("div", { className: "py-12" },
        React.createElement("ul", null, activities.map(function (activity) { return (React.createElement(activity_item_1["default"], { activity: activity, key: activity.id })); }))));
};
function TrackTimePage() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var user, currentActivity, now, startOfToday, endOfToday, dailyActivities;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, auth_1.getUserSession()];
                case 1:
                    user = _b.sent();
                    return [4 /*yield*/, prisma_1.prisma.activity.findFirst({
                            where: {
                                tenantId: (_a = user.tenant) === null || _a === void 0 ? void 0 : _a.id,
                                userId: user.id,
                                endAt: null
                            }
                        })];
                case 2:
                    currentActivity = _b.sent();
                    now = new Date();
                    startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                    return [4 /*yield*/, prisma_1.prisma.activity.findMany({
                            where: {
                                tenantId: user.tenant.id,
                                userId: user.id,
                                OR: [
                                    {
                                        startAt: {
                                            equals: startOfToday
                                        }
                                    },
                                    {
                                        endAt: {
                                            lte: endOfToday
                                        }
                                    }
                                ]
                            },
                            orderBy: {
                                startAt: "asc"
                            }
                        })];
                case 3:
                    dailyActivities = _b.sent();
                    return [2 /*return*/, (React.createElement("main", { className: "container py-4" },
                            React.createElement(NewActivity, { activity: currentActivity }),
                            React.createElement(DailyActivities, { activities: dailyActivities })))];
            }
        });
    });
}
exports["default"] = TrackTimePage;
