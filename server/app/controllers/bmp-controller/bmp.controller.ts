import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { ImageRef } from '@common/image-ref';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BmpController {
    router: Router;

    constructor(private readonly imageRepo: ImageRepositoryService, private readonly logger: LoggerService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:id', async (req: Request, res: Response) => {
            this.logger.logInfo(`Requête ${req.params.id}`);
            try {
                const bmpRequested = (await this.imageRepo.getImageRefById(req.params.id)) as ImageRef;
                if (bmpRequested === undefined) {
                    throw new Error('image not found');
                }
                res.status(StatusCodes.OK).send({
                    image: bmpRequested.base64String,
                });
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        });
    }
}
