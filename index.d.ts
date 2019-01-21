declare module 'react-string-replace' {
  function reactStringReplace(text: React.ReactNode, regex: RegExp, cb: (match: string, index: number) => string | JSX.Element): JSX.Element;

  export default reactStringReplace;
}
