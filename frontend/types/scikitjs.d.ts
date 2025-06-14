declare module "scikitjs" {
  interface DecisionTreeClassifierParams {
    maxDepth?: number;
    randomState?: number;
  }

  export class DecisionTreeClassifier {
    constructor(params?: DecisionTreeClassifierParams);
    fit(X: number[][], y: number[]): Promise<void>;
    predict(X: number[][]): Promise<number[]>;
    toJSON(): object;
    fromJSON(json: object): void;
  }
}
