import { Request, Response, NextFunction } from "express";
import { CreateEmailTempleteUseCase } from "../application/use-cases/create-email-template.usecase";
import { UpdateEmailTemplateUseCase } from "../application/use-cases/update-email-template.usecase";
import { GetEmailTemplateUseCase } from "../application/use-cases/get-email-templates.usecase";
import { toggleEmailTemplateUseCase } from "../application/use-cases/toggle-email-template.usecase";
import { HTTP_STATUS } from "../../../../constants/httpStatus";
import { SendTestEmailUseCase } from "../application/use-cases/send-test-email.usecase";
import { DeleteEmailTemplateUseCase } from "../application/use-cases/delete-email-template.usecase";

export class EmailTemplateController {
  constructor(
    private readonly createUC: CreateEmailTempleteUseCase,
    private readonly updateUC: UpdateEmailTemplateUseCase,
    private readonly listUC: GetEmailTemplateUseCase,
    private readonly toggleUC: toggleEmailTemplateUseCase,
    private readonly sendTestUC : SendTestEmailUseCase,
    private readonly deleteUC : DeleteEmailTemplateUseCase,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.createUC.execute(req.body);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Email template created successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.updateUC.execute(req.params.id, req.body);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email template updated successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.listUC.execute();
    
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email templates fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  toggle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "`isActive` must be a boolean",
        });
      }

      const result = await this.toggleUC.execute(req.params.id, isActive);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Email template status updated",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  sentTest = async (req :Request, res : Response, next : NextFunction) =>{
    try{
        const {email}  = req.body;
        console.log("REq body :", req.body, typeof req.body);
        console.log("REq header :", req.headers["content-type"])
        if(!email){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success : false,
                message : "Email is required"
            })
        }
             await this.sendTestUC.execute({
            templateId : req.params.id,
            to : email,
        })

        return res.status(HTTP_STATUS.OK).json({
            success :  true,
            message : "Test mail send succesfully"
        })
    }catch(err){
        return next(err);
    }
  }

  delete = async (req : Request , res : Response, next : NextFunction) =>{
    try{
        await this.deleteUC.execute(req.params.id);

        return res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Email template deleted succesfully",
        })
    }catch(err){
        return next(err)
    }
  }
}
