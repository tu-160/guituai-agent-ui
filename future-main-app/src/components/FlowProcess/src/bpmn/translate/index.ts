import cn from './cn';


export default function customTranslate(template: any, replacements: any) {
  replacements = replacements || {};

  // Translate
  // @ts-ignore
  template = cn[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_: any, key: any) {
    return replacements[key] || '{' + key + '}';
  });
}
