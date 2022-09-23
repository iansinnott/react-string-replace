declare module "react-string-replace" {
  function reactStringReplace(
    text?: string | React.ReactNode[],
    regex?: string | RegExp,
    cb?: (match: string, index: number, offset: number) => React.ReactNode
  ): React.ReactNode[];

  type ReactStringReplaceRules = {
    search: string | RegExp;
    onMatch: (match: string, index: number) => React.ReactNode;
  }[];

  type ReactStringReplaceProps = {
    rules: ReactStringReplaceRules;
    children: string | React.ReactNode[];
  };

  function ReactStringReplace(props: ReactStringReplaceProps): JSX.Element;

  export {
    reactStringReplace,
    ReactStringReplace,
    ReactStringReplaceProps,
    ReactStringReplaceRules,
  };
}
