import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateArea, createEmptyDimension, formatCurrency } from './areaCalculator.js';

test('1. 2 units: converts ft + in to feet and multiplies them together', () => {
  const row = {
    dimensions: [
      { ft: '10', inch: '0' },
      { ft: '5', inch: '0' },
    ],
  };

  assert.equal(calculateArea(row), 50);
});

test('2. 3 units after clicking Add Unit: multiplies all 3 converted units', () => {
  const row = {
    dimensions: [
      { ft: '10', inch: '6' }, // 10.5 ft
      { ft: '5', inch: '3' },  // 5.25 ft
      { ft: '2', inch: '6' },  // 2.5 ft
    ],
  };

  // Result = 10.5 × 5.25 × 2.5 = 137.8125
  assert.equal(calculateArea(row), 10.5 * 5.25 * 2.5);
  assert.equal(calculateArea(row), 137.8125);
  // Verify it is NOT the sum 10 + 6 + 5 + 3 + 2 + 6
  assert.notEqual(calculateArea(row), 10 + 6 + 5 + 3 + 2 + 6);
  assert.notEqual(calculateArea(row), 10.5 + 5.25 + 2.5);
});

test('3. 4+ units: correctly multiplies 4 units together', () => {
  const row = {
    dimensions: [
      { ft: '2', inch: '0' },
      { ft: '3', inch: '0' },
      { ft: '4', inch: '0' },
      { ft: '5', inch: '0' },
    ],
  };

  assert.equal(calculateArea(row), 2 * 3 * 4 * 5); // 120
});

test('4. Removing a unit: calculation updates after a unit is removed', () => {
  const row = {
    dimensions: [
      { ft: '2', inch: '0' },
      { ft: '3', inch: '0' },
      { ft: '4', inch: '0' },
      { ft: '5', inch: '0' },
    ],
  };

  assert.equal(calculateArea(row), 120);

  // Remove 4th unit
  row.dimensions.pop();
  assert.equal(calculateArea(row), 2 * 3 * 4); // 24

  // Remove 3rd unit down to 2 units
  row.dimensions.pop();
  assert.equal(calculateArea(row), 2 * 3); // 6
});

test('5. Decimal/inch conversion: inch / 12 properly added to feet', () => {
  const row = {
    dimensions: [
      { ft: '0', inch: '6' }, // 0.5 ft
      { ft: '0', inch: '3' }, // 0.25 ft
      { ft: '0', inch: '9' }, // 0.75 ft
    ],
  };

  assert.equal(calculateArea(row), 0.5 * 0.25 * 0.75);
});

test('6. Empty fields: handles empty inputs safely without crashing or NaN', () => {
  // All fields empty
  assert.equal(calculateArea({ dimensions: [createEmptyDimension(), createEmptyDimension()] }), 0);

  // Empty inch defaults to 0 inch
  const rowEmptyInch = {
    dimensions: [
      { ft: '10', inch: '' },
      { ft: '5', inch: '' },
    ],
  };
  assert.equal(calculateArea(rowEmptyInch), 50);

  // Empty ft defaults to 0 ft
  const rowEmptyFt = {
    dimensions: [
      { ft: '', inch: '6' },
      { ft: '10', inch: '0' },
    ],
  };
  assert.equal(calculateArea(rowEmptyFt), 5);

  // Missing or undefined dimensions safely returns 0
  assert.equal(calculateArea(null), 0);
  assert.equal(calculateArea({}), 0);
  assert.equal(calculateArea({ dimensions: [] }), 0);
});

test('7. Changing an existing unit after adding another unit', () => {
  const row = {
    dimensions: [
      { ft: '10', inch: '6' },
      { ft: '5', inch: '3' },
    ],
  };

  // Add a 3rd unit
  row.dimensions.push({ ft: '2', inch: '6' });
  assert.equal(calculateArea(row), 10.5 * 5.25 * 2.5);

  // Change existing unit 1 from 10 ft 6 in to 12 ft 0 in
  row.dimensions[0] = { ft: '12', inch: '0' };
  assert.equal(calculateArea(row), 12 * 5.25 * 2.5); // 157.5
});

test('8. formatCurrency formats numbers with Indian numbering style and ₹ symbol', () => {
  assert.equal(formatCurrency(160380), '₹1,60,380.00');
  assert.equal(formatCurrency(1234567.89), '₹12,34,567.89');
  assert.equal(formatCurrency(0), '₹0.00');
});
