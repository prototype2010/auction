'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bids
 */
class BidController {
  /**
   * Show a list of all bids.
   * GET bids
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async index ({ request, response, view }) {}
  // async store ({ request, response }) {}
  /**
   * Display a single bid.
   * GET bids/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  // async show ({ params, request, response, view }) {}
  // async update ({ params, request, response }) {}
  /**
   * Delete a bid with id.
   * DELETE bids/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  // async destroy ({ params, request, response }) {}
}

module.exports = BidController;
