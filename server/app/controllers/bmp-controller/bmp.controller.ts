// import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
// import { BmpService } from '@app/services/bmp-service/bmp.service';
import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { ImageRef } from '@common/image-ref';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BmpController {
    router: Router;

    constructor(private readonly imageRepo: ImageRepositoryService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // this.router.get('/:id', async (req: Request, res: Response) => {
        //     try {
        //         const bmpRequested = await this.bmpService.getBmpById(req.params.id, DEFAULT_BMP_ASSET_PATH);
        //         res.status(StatusCodes.OK).send({
        //             image: bmpRequested,
        //         });
        //     } catch (error) {
        //         res.status(StatusCodes.NOT_FOUND).send();
        //     }
        // });

        this.router.get('/:id', async (req: Request, res: Response) => {
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
