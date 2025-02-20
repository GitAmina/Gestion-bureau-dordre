declare module "pdfmake/build/pdfmake" {
  const pdfMake: any;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  const pdfFonts: any;
  export default pdfFonts;
}

declare module "pdfmake/interfaces" {
  export interface TDocumentDefinitions {
    content: any[];
    styles?: { [key: string]: any };
  }
}
