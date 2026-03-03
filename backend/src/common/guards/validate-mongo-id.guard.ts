import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VALIDATE_MONGO_ID } from '../decorators/ValidateMongoId.decorator';
import mongoose from 'mongoose';

@Injectable()
export class ValidateMongoIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const fields = this.reflector.get(VALIDATE_MONGO_ID, context.getHandler()) as {
        body?: string[],
        param?: string[],
        query?: string[]
    };

    if(!fields) return true;

    this.validateMongoId(fields.body, req.body)
    this.validateMongoId(fields.param, req.params),
    this.validateMongoId(fields.query, req.query)
    
    return true;
  }

  validateMongoId(keys:  string[] = [], source: any){
    for(const key of keys){
        const value:string = source?.[key]

        if(!value) continue;

        if(!mongoose.isValidObjectId(value)){
            throw new BadRequestException({
                code: "INVALID_ID",
                msg: `Value of ${key} is invalid.`,
                details: {
                    field: [key],
                    value: [value]
                }
            })
        }
    }
  }
}
