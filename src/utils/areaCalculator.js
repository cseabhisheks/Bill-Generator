export const createEmptyDimension = () => ({
  ft: "",
  inch: "",
});

export const getDimensions = (row) => {
  if (Array.isArray(row?.dimensions) && row.dimensions.length > 0) {
    return row.dimensions;
  }

  return [
    {
      ft: row?.feet1 ?? "",
      inch: row?.inch1 ?? "",
    },
    {
      ft: row?.feet2 ?? "",
      inch: row?.inch2 ?? "",
    },
  ];
};

export const calculateArea = (row) => {
  const dimensions = getDimensions(row);
  if (!dimensions || dimensions.length === 0) {
    return 0;
  }

  let hasAnyInput = false;
  let product = 1;

  for (const dimension of dimensions) {
    const rawFt = dimension?.ft;
    const rawInch = dimension?.inch;

    const hasFt = rawFt !== "" && rawFt !== null && rawFt !== undefined;
    const hasInch = rawInch !== "" && rawInch !== null && rawInch !== undefined;

    if (hasFt || hasInch) {
      hasAnyInput = true;
    }

    const ft = Math.max(0, Number.parseFloat(rawFt) || 0);
    const inch = Math.max(0, Number.parseFloat(rawInch) || 0);
    const decimalFeet = ft + inch / 12;

    product *= decimalFeet;
  }

  if (!hasAnyInput) {
    return 0;
  }

  return Number.isFinite(product) ? Math.max(0, product) : 0;
};

export const calculateAmount = (row) => {
  return calculateArea(row) * (Number(row.rate) || 0);
};

export const calculateTotal = (rows) => {
  return rows.reduce(
    (total, row) => total + calculateArea(row),
    0
  );
};

export const calculateTotalAmount = (rows) => {
  return rows.reduce(
    (total, row) => total + calculateAmount(row),
    0
  );
};

export const calculateCommonRateAmount = (rows, commonRate) => {
  const rate = Number.parseFloat(commonRate || 0);
  if (!Number.isFinite(rate) || rate <= 0) {
    return 0;
  }

  return calculateTotal(rows) * rate;
};