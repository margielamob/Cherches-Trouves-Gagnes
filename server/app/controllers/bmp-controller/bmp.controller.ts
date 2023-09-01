import { DEFAULT_BMP_ASSET_PATH } from '@app/constants/database';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class BmpController {
    router: Router;

    constructor(private readonly bmpService: BmpService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.get('/:id', async (req: Request, res: Response) => {
            try {
                const bmpRequested = await this.bmpService.getBmpById(req.params.id, DEFAULT_BMP_ASSET_PATH);
                res.status(StatusCodes.OK).send({
                    image: bmpRequested,
                });
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).send();
            }
        });
    }
}
