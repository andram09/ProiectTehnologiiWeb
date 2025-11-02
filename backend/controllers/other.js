import {db} from '../models/index.js'

export const controller ={
    resetDb:async (req,res)=>{
      try {
      await db.sync({ force: true });
      res.status(200).send({ message: 'Baza de date a fost resetata!' });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: 'Eroare in timpul resetarii' });
    }
  }
}

