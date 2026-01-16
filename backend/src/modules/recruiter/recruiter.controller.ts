// import { Request, Response } from "express";
// import { HTTP_STATUS } from "../../constants/httpStatus";
// import { getError } from "../../utils/getErrorMessage";
// import {
//   getRecruiterProfileService,
//   updateRecruiterPasswordService,
//   updateRecruiterProfileService,
// } from "./recruiter.service";


// export const getRecruiterProfile = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(HTTP_STATUS.UNAUTHORIZED).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const profile = await getRecruiterProfileService(req.user.userId);

//     res.status(HTTP_STATUS.OK).json({
//       success: true,
//       data: profile,
//     });
//   } catch (err) {
//     res.status(HTTP_STATUS.BAD_REQUEST).json({
//       success: false,
//       message: getError(err),
//     });
//   }
// };


// export const updateRecruiterProfile = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(HTTP_STATUS.UNAUTHORIZED).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const updatedProfile = await updateRecruiterProfileService(
//       req.user.userId,
//       req.body
//     );

//     res.status(HTTP_STATUS.OK).json({
//       success: true,
//       message: "Recruiter profile updated successfully",
//       data: updatedProfile,
//     });
//   } catch (err) {
//     res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: getError(err),
//     });
//   }
// };


// export const updateRecruiterPassword = async (
//   req: Request,
//   res: Response
// ) => {

//   try {
//     if (!req.user) {
//       return res.status(HTTP_STATUS.UNAUTHORIZED).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(HTTP_STATUS.BAD_REQUEST).json({
//         success: false,
//         message: "Current password and new password are required",
//       });
//     }

//     await updateRecruiterPasswordService(
//       req.user.userId,
//       currentPassword,
//       newPassword
//     );

//     res.status(HTTP_STATUS.OK).json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (err : any) {
//     console.error("error in recruiter password update", err)
//     res.status(HTTP_STATUS.BAD_REQUEST).json({
//       success: false,
//       message: getError(err),
//     });
//   }
// };
