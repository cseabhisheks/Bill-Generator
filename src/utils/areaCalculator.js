export const calculateArea = (row) => {
  const length =
    (Number(row.feet1) || 0) +
    (Number(row.inch1) || 0) / 12;

  const width =
    (Number(row.feet2) || 0) +
    (Number(row.inch2) || 0) / 12;

  return length * width;
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