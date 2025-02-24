"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const routing_controllers_1 = require("routing-controllers");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const typedi_1 = require("typedi");
const report_service_1 = require("../services/report.service");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getReport(userId) {
        return await this.reportService.getReport(userId);
    }
    async getTalentAnalysis(userId) {
        return await this.reportService.getTalentAnalysis(userId);
    }
    async getElementAnalysis(userId) {
        return await this.reportService.getElementAnalysis(userId);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, routing_controllers_1.Get)('/detail/:userId'),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: '获取用户报告详情' }),
    __param(0, (0, routing_controllers_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getReport", null);
__decorate([
    (0, routing_controllers_1.Get)('/talent-analysis/:userId'),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: '获取用户天赋分析' }),
    __param(0, (0, routing_controllers_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getTalentAnalysis", null);
__decorate([
    (0, routing_controllers_1.Get)('/element-analysis/:userId'),
    (0, routing_controllers_openapi_1.OpenAPI)({ summary: '获取用户元素分析详情' }),
    __param(0, (0, routing_controllers_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getElementAnalysis", null);
exports.ReportController = ReportController = __decorate([
    (0, routing_controllers_1.JsonController)('/report'),
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Authorized)(),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
