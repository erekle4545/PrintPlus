import LangData from "../../language/langs/formLangData.json";
import Alert from "@mui/material/Alert";
// slug generation
 const  specialChars = () => {
      return { 'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'ph', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'kh', 'შ': 'sh', 'ჩ': 'ch', 'ც': 'c', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'x', 'ჯ': 'j', 'ჰ': 'h', 'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'io', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'i', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': '', 'ь': '', 'э': 'e', 'ю': 'iu' }
}
export const slugGenerate = (slug)=>{
      return  slug.toLowerCase().replace(/\s+/g, '-').replace(/./g,(target, index, str) => specialChars()[target] || target).replace(/&/g, '-and-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
}
//end Slug generate
// Lang translate
export const translate = (translateName,langCode)=>{
      return  LangData[translateName][langCode]?LangData[translateName][langCode]:LangData[translateName][localStorage.getItem('lang')]
}
// End translate Lang
// if is set  object translate example: title
export const checkTranslate = (status,params,lang)=>{
     if(status && params){
        return (
            <div className='col-xl-12 p-4 '>
                <Alert className='title_font' severity="warning">
                    <strong>ყურადღება!</strong> {lang} ამ ენაზე არ არის ჩანაწერი ნათარგმნი
                </Alert>
            </div>);

     }
}

