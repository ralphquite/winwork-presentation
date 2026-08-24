export type DemoStep = {
  id: string;
  label: string;
};

export type DemoFixture = {
  id: string;
  initialStep: number;
  steps: readonly DemoStep[];
};
