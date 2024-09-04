// function to delete any file that i need to delete:
// import modules:
import fs from 'fs';
import path from 'path';
// function
export const deleteFile = (fullPath)=>{
 fs.unlinkSync(path.resolve(fullPath))
}
 

