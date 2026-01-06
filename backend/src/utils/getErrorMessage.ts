export const getError = (error : unknown):string =>{
    if(error instanceof Error)return error.message;
    return "something is wrong"
}

