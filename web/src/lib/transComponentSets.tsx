export const orangeTriangleEmphasis = {
  icon: (
    <span className="triangle-clip mr-1 inline-block h-4 w-4 bg-success-orange align-middle" />
  ),
  1: (
    <span className="font-bold underline decoration-success-orange decoration-dashed decoration-2" />
  ),
} as const;

export const pinkSquareEmphasis = {
  icon: <span className="mr-1 inline-block h-4 w-4 bg-tertiary align-middle" />,
  1: (
    <span className="font-bold underline decoration-tertiary decoration-dashed decoration-2" />
  ),
} as const;
