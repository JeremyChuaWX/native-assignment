import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from "@nestjs/common";
import { ZodSchema } from "zod";

@Injectable()
export class Validate implements PipeTransform {
    constructor(private readonly schema: ZodSchema) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch {
            throw new BadRequestException("validation failed");
        }
    }
}
