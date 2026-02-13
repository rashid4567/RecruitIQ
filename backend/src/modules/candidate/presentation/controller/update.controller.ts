




//     updatePassword = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { currentPassword, newPassword } = req.body;

//       await this.updatePasswordUC.execute(
//         req.user!.userId,
//         currentPassword,
//         newPassword,
//       );

//       res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: "Password updated successfully",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

//   requestEmailUpdate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       await this.requestEmailUpdateUC.execute(
//         req.user!.userId,
//         req.body.newEmail,
//       );

//       res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: "OTP sent to new email",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

//   verifyEmailUpdate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       await this.verifyEmailUpdateUC.execute({
//         userId: req.user!.userId,
//         newEmail: req.body.newEmail,
//         otp: req.body.otp,
//       });

//       res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: "Email updated successfully",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

