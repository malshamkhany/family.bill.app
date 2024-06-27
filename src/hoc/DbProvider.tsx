import Loader from "@/components/Loader";
import MongoDbContext from "@/db/mongodb";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const DbContext = createContext<MongoDbContext | null>(null);

const DbProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [dbContext, setDbContext] = useState<MongoDbContext>(null);

  useEffect(() => {
    const connectDb = async () => {
      const db = new MongoDbContext();
      await db.connect();

      setDbContext(db);
    };
    connectDb();
  }, []);

  if (!dbContext) {
    return <Loader />;
  }

  return <DbContext.Provider value={dbContext}>{children}</DbContext.Provider>;
};

const useDb = (): MongoDbContext => {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
};

export { DbProvider, DbContext, useDb };
