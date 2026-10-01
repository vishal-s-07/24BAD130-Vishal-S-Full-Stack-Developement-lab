const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();


// ==========================================
// CREATE CONTACT
// POST /contacts
// ==========================================

router.post("/", async (req, res) => {
    try {
        const contact = new Contact(req.body);

        const savedContact = await contact.save();

        res.status(201).json({
            success: true,
            message: "Contact created successfully",
            data: savedContact
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Contact ID or email already exists"
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// ==========================================
// GET ALL CONTACTS
// GET /contacts
// ==========================================

router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find();

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve contacts"
        });
    }
});


// ==========================================
// GET CONTACT BY ID
// GET /contacts/:id
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const contact = await Contact.findOne({
            contactId: req.params.id
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to retrieve contact"
        });
    }
});


// ==========================================
// UPDATE CONTACT
// PUT /contacts/:id
// ==========================================

router.put("/:id", async (req, res) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            {
                contactId: req.params.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


// ==========================================
// DELETE CONTACT
// DELETE /contacts/:id
// ==========================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedContact = await Contact.findOneAndDelete({
            contactId: req.params.id
        });

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            data: deletedContact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete contact"
        });
    }
});


module.exports = router;