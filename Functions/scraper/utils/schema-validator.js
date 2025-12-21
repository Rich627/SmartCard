/**
 * Schema Validator for iOS CreditCard Model
 *
 * Validates scraped card data against the iOS CreditCard.swift structure
 * to ensure all cards can be properly decoded by the iOS app.
 */

const { getValidCategories, isValidCategory } = require('./categories');

// Valid enum values (must match iOS enums)
const VALID_NETWORKS = ['visa', 'mastercard', 'amex', 'discover'];
const VALID_REWARD_TYPES = ['cashback', 'points', 'miles'];
const VALID_CAP_PERIODS = ['monthly', 'quarterly', 'yearly'];

/**
 * Validate a single card against the iOS schema
 * @param {Object} card - The card object to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validateCard(card) {
  const errors = [];

  // Required string fields
  if (!card.id || typeof card.id !== 'string') {
    errors.push(`Missing or invalid 'id' field`);
  }
  if (!card.name || typeof card.name !== 'string') {
    errors.push(`Missing or invalid 'name' field`);
  }
  if (!card.issuer || typeof card.issuer !== 'string') {
    errors.push(`Missing or invalid 'issuer' field`);
  }

  // Network enum
  if (!VALID_NETWORKS.includes(card.network)) {
    errors.push(`Invalid network '${card.network}'. Must be one of: ${VALID_NETWORKS.join(', ')}`);
  }

  // RewardType enum
  if (!VALID_REWARD_TYPES.includes(card.rewardType)) {
    errors.push(`Invalid rewardType '${card.rewardType}'. Must be one of: ${VALID_REWARD_TYPES.join(', ')}`);
  }

  // Required number fields
  if (typeof card.annualFee !== 'number') {
    errors.push(`Missing or invalid 'annualFee' field (must be number)`);
  }
  if (typeof card.baseReward !== 'number') {
    errors.push(`Missing or invalid 'baseReward' field (must be number)`);
  }

  // Required boolean field
  if (typeof card.baseIsPercentage !== 'boolean') {
    errors.push(`Missing or invalid 'baseIsPercentage' field (must be boolean)`);
  }

  // Validate categoryRewards array
  if (!Array.isArray(card.categoryRewards)) {
    errors.push(`'categoryRewards' must be an array`);
  } else {
    card.categoryRewards.forEach((reward, index) => {
      const rewardErrors = validateCategoryReward(reward, index);
      errors.push(...rewardErrors);
    });

  }

  // Validate rotatingCategories (optional)
  if (card.rotatingCategories !== null && card.rotatingCategories !== undefined) {
    if (!Array.isArray(card.rotatingCategories)) {
      errors.push(`'rotatingCategories' must be an array or null`);
    } else {
      card.rotatingCategories.forEach((rotating, index) => {
        const rotatingErrors = validateRotatingCategory(rotating, index);
        errors.push(...rotatingErrors);
      });
    }
  }

  // Validate selectableConfig (optional)
  if (card.selectableConfig !== null && card.selectableConfig !== undefined) {
    const selectableErrors = validateSelectableConfig(card.selectableConfig);
    errors.push(...selectableErrors);
  }

  // imageColor should be a string (hex color)
  if (card.imageColor && typeof card.imageColor !== 'string') {
    errors.push(`'imageColor' must be a string`);
  }

  // imageURL is optional but should be string if present
  if (card.imageURL !== null && card.imageURL !== undefined && typeof card.imageURL !== 'string') {
    errors.push(`'imageURL' must be a string or null`);
  }

  return {
    valid: errors.length === 0,
    errors: errors.map(e => `[${card.name || card.id || 'Unknown'}] ${e}`)
  };
}

/**
 * Validate a CategoryReward object
 */
function validateCategoryReward(reward, index) {
  const errors = [];
  const prefix = `categoryRewards[${index}]`;

  if (!reward.category || typeof reward.category !== 'string') {
    errors.push(`${prefix}: Missing or invalid 'category' field`);
  } else if (!isValidCategory(reward.category)) {
    errors.push(`${prefix}: Invalid category '${reward.category}'. Must be one of: ${getValidCategories().join(', ')}`);
  }

  if (typeof reward.multiplier !== 'number') {
    errors.push(`${prefix}: Missing or invalid 'multiplier' field (must be number)`);
  }

  if (typeof reward.isPercentage !== 'boolean') {
    errors.push(`${prefix}: Missing or invalid 'isPercentage' field (must be boolean)`);
  }

  // cap is optional (can be null or number)
  if (reward.cap !== null && reward.cap !== undefined && typeof reward.cap !== 'number') {
    errors.push(`${prefix}: 'cap' must be a number or null`);
  }

  // capPeriod is optional but must be valid enum if present
  if (reward.capPeriod !== null && reward.capPeriod !== undefined) {
    if (!VALID_CAP_PERIODS.includes(reward.capPeriod)) {
      errors.push(`${prefix}: Invalid capPeriod '${reward.capPeriod}'. Must be one of: ${VALID_CAP_PERIODS.join(', ')}`);
    }
  }

  return errors;
}

/**
 * Validate a RotatingCategory object
 */
function validateRotatingCategory(rotating, index) {
  const errors = [];
  const prefix = `rotatingCategories[${index}]`;

  if (typeof rotating.quarter !== 'number' || rotating.quarter < 1 || rotating.quarter > 4) {
    errors.push(`${prefix}: 'quarter' must be a number between 1-4`);
  }

  if (typeof rotating.year !== 'number') {
    errors.push(`${prefix}: 'year' must be a number`);
  }

  if (!Array.isArray(rotating.categories)) {
    errors.push(`${prefix}: 'categories' must be an array`);
  } else {
    rotating.categories.forEach((cat, catIndex) => {
      if (!isValidCategory(cat)) {
        errors.push(`${prefix}.categories[${catIndex}]: Invalid category '${cat}'`);
      }
    });
  }

  if (typeof rotating.multiplier !== 'number') {
    errors.push(`${prefix}: 'multiplier' must be a number`);
  }

  if (typeof rotating.isPercentage !== 'boolean') {
    errors.push(`${prefix}: 'isPercentage' must be a boolean`);
  }

  return errors;
}

/**
 * Validate SelectableConfig object
 */
function validateSelectableConfig(config) {
  const errors = [];
  const prefix = 'selectableConfig';

  if (typeof config.maxSelections !== 'number') {
    errors.push(`${prefix}: 'maxSelections' must be a number`);
  }

  if (!Array.isArray(config.availableCategories)) {
    errors.push(`${prefix}: 'availableCategories' must be an array`);
  } else {
    config.availableCategories.forEach((cat, index) => {
      if (!isValidCategory(cat)) {
        errors.push(`${prefix}.availableCategories[${index}]: Invalid category '${cat}'`);
      }
    });
  }

  if (typeof config.multiplier !== 'number') {
    errors.push(`${prefix}: 'multiplier' must be a number`);
  }

  if (typeof config.isPercentage !== 'boolean') {
    errors.push(`${prefix}: 'isPercentage' must be a boolean`);
  }

  return errors;
}

/**
 * Validate all cards
 * @param {Array} cards - Array of card objects
 * @returns {Object} - { passed: boolean, totalCards: number, validCards: number, errors: string[] }
 */
function validateAllCards(cards) {
  const allErrors = [];
  let validCount = 0;

  cards.forEach(card => {
    const result = validateCard(card);
    if (result.valid) {
      validCount++;
    } else {
      allErrors.push(...result.errors);
    }
  });

  return {
    passed: allErrors.length === 0,
    totalCards: cards.length,
    validCards: validCount,
    invalidCards: cards.length - validCount,
    errors: allErrors
  };
}

/**
 * Print validation summary
 */
function printValidationSummary(result) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 Schema Validation Summary');
  console.log('='.repeat(60));
  console.log(`Total Cards: ${result.totalCards}`);
  console.log(`Valid Cards: ${result.validCards} ✅`);
  console.log(`Invalid Cards: ${result.invalidCards} ❌`);

  if (result.errors.length > 0) {
    console.log('\n🚨 Validation Errors:');
    result.errors.forEach(error => {
      console.log(`  - ${error}`);
    });
  }

  console.log('='.repeat(60));
  console.log(result.passed ? '✅ All cards passed validation!' : '❌ Validation failed!');
  console.log('='.repeat(60) + '\n');
}

module.exports = {
  validateCard,
  validateAllCards,
  printValidationSummary,
  VALID_NETWORKS,
  VALID_REWARD_TYPES,
  VALID_CAP_PERIODS
};
