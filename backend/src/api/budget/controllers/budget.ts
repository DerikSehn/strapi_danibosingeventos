import { factories } from '@strapi/strapi';
import { fetchPartyType, fetchSelectedItemsDetails } from '../services/fetch-items';
import { calculateBudget } from '../services/calculate-budget';

export default factories.createCoreController(
  'api::budget.budget',
  ({ strapi }) => ({
    /**
     * @swagger
     * /api/budgets:
     *   get:
     *     tags:
     *       - Budget
     *     summary: List all budgets
     *     description: Retrieves a list of all budgets in the system
     *     responses:
     *       200:
     *         description: List of budgets retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                   documentId:
     *                     type: string
     *                   totalPrice:
     *                     type: number
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *       500:
     *         description: Internal server error
     */
    async listBudgets(ctx) {
      try {
        const budgets = await strapi.services['api::budget.budget'].find();
        ctx.send(budgets);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
    
    /**
     * @swagger
     * /api/budgets/{id}:
     *   get:
     *     tags:
     *       - Budget
     *     summary: Get a specific budget
     *     description: Retrieves a single budget by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Budget ID
     *     responses:
     *       200:
     *         description: Budget retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 documentId:
     *                   type: string
     *                 totalPrice:
     *                   type: number
     *                 eventDetails:
     *                   type: string
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *       404:
     *         description: Budget not found
     *       500:
     *         description: Internal server error
     */
    async getBudget(ctx) {
      try {
        const { id } = ctx.params;
        const budget = await strapi.services['api::budget.budget'].findOne({
          id,
        });
        ctx.send(budget);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
    
    /**
     * @swagger
     * /api/budgets/{id}:
     *   put:
     *     tags:
     *       - Budget
     *     summary: Update a budget
     *     description: Updates an existing budget
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Budget ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               eventDetails:
     *                 type: string
     *                 description: Updated event details
     *               totalPrice:
     *                 type: number
     *                 description: Updated total price
     *     responses:
     *       200:
     *         description: Budget updated successfully
     *       404:
     *         description: Budget not found
     *       500:
     *         description: Internal server error
     */
    async updateBudget(ctx) {
      try {
        const { id } = ctx.params;
        const updatedBudget = await strapi.services[
          'api::budget.budget'
        ].update({ id }, ctx.request.body);
        ctx.send(updatedBudget);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
    
    /**
     * @swagger
     * /api/budgets:
     *   post:
     *     tags:
     *       - Budget
     *     summary: Create a new budget
     *     description: Creates a new budget with party type, selected items and contact information
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - partyType
     *               - selectedItems
     *               - contactInfo
     *               - numberOfPeople
     *             properties:
     *               partyType:
     *                 type: string
     *                 description: Party type document ID
     *               selectedItems:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of selected item IDs
     *               contactInfo:
     *                 type: object
     *                 required:
     *                   - name
     *                   - phone
     *                 properties:
     *                   name:
     *                     type: string
     *                   phone:
     *                     type: string
     *               numberOfPeople:
     *                 type: integer
     *                 minimum: 1
     *               eventDetails:
     *                 type: string
     *     responses:
     *       201:
     *         description: Budget created successfully
     *       400:
     *         description: Bad request - missing required fields
     *       404:
     *         description: Party type not found
     *       500:
     *         description: Internal server error
     */
    async create(ctx) {
      const { 
        partyType, 
        selectedItems, 
        contactInfo, 
        eventDetails, 
        numberOfPeople, 
      } = ctx.request.body;

      try {
        // Validate required fields
        if (!partyType || !selectedItems || !contactInfo || !numberOfPeople) {
          return ctx.badRequest('Missing required fields');
        }

        // Fetch the party type details
        const partyTypeDetails = await fetchPartyType(strapi, partyType);
        if (!partyTypeDetails) {
          return ctx.notFound('Party type not found');
        }        

        // Fetch the selected items details
        const selectedItemsDetails = await fetchSelectedItemsDetails(strapi, selectedItems);

        // Calculate the budget
        const budgetCalculation = calculateBudget(
          partyTypeDetails as any,
          selectedItemsDetails as any[],
          numberOfPeople,
        );

        // Save the budget to the database
        const newBudget = await strapi.documents('api::budget.budget').create({
          data: {
            partyType,
            eventDetails,
            ...budgetCalculation,
          },
        });

        ctx.send(newBudget);
      } catch (error) {
        console.error('Error creating budget:', error);
        ctx.throw(500, 'Internal server error');
      }
    },
  }),
);
