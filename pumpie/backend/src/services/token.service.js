const Token = require('../models/token.model');

class TokenService {
  /**
   * Create a new token
   * @param {Object} tokenData Token data
   * @returns {Promise<Object>} Created token
   */
  async createToken(tokenData) {
    try {
      const token = new Token(tokenData);
      const savedToken = await token.save();
      return this.formatTokenResponse(savedToken);
    } catch (error) {
      console.error('Error in createToken:', error);
      throw error;
    }
  }

  /**
   * Get all tokens
   * @returns {Promise<Array>} List of tokens
   */
  async getAllTokens() {
    try {
      const tokens = await Token.find().sort({ createdAt: -1 });
      return tokens.map(token => this.formatTokenResponse(token));
    } catch (error) {
      console.error('Error in getAllTokens:', error);
      throw error;
    }
  }

  /**
   * Get token by ID
   * @param {string} id Token ID
   * @returns {Promise<Object>} Token data
   */
  async getTokenById(id) {
    try {
      const token = await Token.findById(id);
      if (!token) {
        throw new Error('Token not found');
      }
      return this.formatTokenResponse(token);
    } catch (error) {
      console.error('Error in getTokenById:', error);
      throw error;
    }
  }

  /**
   * Update token pool status
   * @param {string} id Token ID
   * @param {Object} updateData Update data (inPool, poolAddress, tokenAddress)
   * @returns {Promise<Object>} Updated token
   */
  async updateTokenPool(id, updateData) {
    try {
      const token = await Token.findByIdAndUpdate(
        id,
        {
          inPool: updateData.inPool,
          poolAddress: updateData.poolAddress,
          ...(updateData.tokenAddress && { tokenAddress: updateData.tokenAddress })
        },
        { new: true }
      );
      if (!token) {
        throw new Error('Token not found');
      }
      return this.formatTokenResponse(token);
    } catch (error) {
      console.error('Error in updateTokenPool:', error);
      throw error;
    }
  }

  /**
   * Update token creator address
   * @param {string} id Token ID
   * @param {string} address New creator address
   * @returns {Promise<Object>} Updated token
   */
  async updateTokenAddress(id, address) {
    try {
      const token = await Token.findByIdAndUpdate(
        id,
        { creatorAddress: address },
        { new: true }
      );
      if (!token) {
        throw new Error('Token not found');
      }
      return this.formatTokenResponse(token);
    } catch (error) {
      console.error('Error in updateTokenAddress:', error);
      throw error;
    }
  }

  /**
   * Format token response
   * @param {Object} token Token document
   * @returns {Object} Formatted token
   */
  formatTokenResponse(token) {
    const tokenObj = token.toObject();
    return {
      ...tokenObj,
      id: tokenObj._id
    };
  }
}

module.exports = new TokenService();
