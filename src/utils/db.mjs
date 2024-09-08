import { PrismaClient } from "@prisma/client";

class DBInstance {
  static dbInstance= null;

  static getInstance() {
    if(DBInstance.dbInstance === null){
      DBInstance.dbInstance = new PrismaClient(); 
    }
    return DBInstance.dbInstance; 
  }
}


const prisma = DBInstance.getInstance();
export default prisma;
