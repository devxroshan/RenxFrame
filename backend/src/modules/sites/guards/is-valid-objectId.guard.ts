import { BadRequestException, CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import mongoose from "mongoose";;

@Injectable()
export class IsValidMongooseObjectIdGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean  {
        const req = context.switchToHttp().getRequest();

        if(!req.query.site_id && !req.params.site_id){
            throw new BadRequestException({
                code: HttpStatus.BAD_REQUEST,
                msg: 'site_id is required in query.',
            })
        }

        if(!mongoose.isValidObjectId(req.query.site_id) && !mongoose.isValidObjectId(req.params.site_id)){
            throw new BadRequestException({
                code: HttpStatus.BAD_REQUEST,
                msg: 'Invalid site_id.'
            })
        }

        return true;
    }
}