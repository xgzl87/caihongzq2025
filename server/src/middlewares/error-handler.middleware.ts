import { KoaMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import { Context } from 'koa';
import { logger } from '../config/logger';

interface ErrorResponse {
    code: number;
    message: string;
    details?: any;
}

@Service()
export class ErrorHandlerMiddleware implements KoaMiddlewareInterface {
    async use(ctx: Context, next: (err?: any) => Promise<any>): Promise<any> {
        try {
            await next();
        } catch (error) {
            // 记录错误日志
            logger.error('Request failed', {
                path: ctx.path,
                method: ctx.method,
                params: ctx.params,
                query: ctx.query,
                body: ctx.request.body,
                error: {
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    name: error instanceof Error ? error.name : 'UnknownError',
                    ...((error instanceof Error && error.cause) ? { cause: error.cause } : {})
                }
            });

            // 构造错误响应
            const errorResponse: ErrorResponse = {
                code: this.getHttpStatusCode(error),
                message: this.getErrorMessage(error),
                details: this.getErrorDetails(error)
            };

            // 设置响应状态码和内容
            ctx.status = errorResponse.code;
            ctx.body = errorResponse;

            // 确保错误被标记为已处理
            ctx.app.emit('error', error, ctx);
        }
    }

    private getHttpStatusCode(error: any): number {
        if ('httpCode' in error || 'status' in error) {
            return (error.httpCode || error.status);
        }
        
        // 根据错误类型返回适当的状态码
        switch (error.name) {
            case 'ValidationError':
                return 400;
            case 'UnauthorizedError':
                return 401;
            case 'ForbiddenError':
                return 403;
            case 'NotFoundError':
                return 404;
            default:
                return 500;
        }
    }

    private getErrorMessage(error: any): string {
        if (error instanceof Error) {
            return error.message;
        }
        return '服务器内部错误';
    }

    private getErrorDetails(error: any): any {
        if (process.env.NODE_ENV === 'production') {
            return undefined;
        }

        if (error instanceof Error) {
            return {
                name: error.name,
                stack: error.stack,
                ...(error.cause ? { cause: error.cause } : {})
            };
        }

        return error;
    }
}