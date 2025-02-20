export type Package = {
  name: string;
  price: number;
  invoiceDate: string;
  status: string;
};

export type Package1 = {
  id: number;
  reference: string;
  type: string;
  expediteur: string;
  destinaitaire: string;
  sujet: string;
  etat: string;
  datereception: string;
  dateenvoie: string;
  archive: boolean;
};
