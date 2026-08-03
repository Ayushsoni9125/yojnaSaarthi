import mongoose, { Schema, Document, models, model } from "mongoose";
import {
    SCHEME_CATEGORIES,
    SCHEME_STATUS,
} from "@/constants/scheme";

interface ISchemeSource {
    name: string;
    url: string;
    scrapedAt: Date;
}

export interface IScheme extends Document {
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    benefits: string[];
    documents: string[];
    tags: string[];
    states: string[];

    category: string;
    ministry: string;

    officialUrl: string;

    sources: ISchemeSource[];

    lastScrapedAt: Date;

    sourceCount: number;

    status: "Active" | "Upcoming" | "Expired";

    createdAt: Date;
    updatedAt: Date;
}

const SchemeSchema = new Schema<IScheme>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        shortDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 250,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: SCHEME_CATEGORIES,
            required: true,
            index: true,
        },

        ministry: {
            type: String,
            required: true,
            index: true,
        },

        officialUrl: {
            type: String,
            required: true,
        },


        sources: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                    scrapedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            default: [],
        },

        lastScrapedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        sourceCount: {
            type: Number,
            default: 1,
        },

        status: {
            type: String,
            enum: SCHEME_STATUS,
            default: "Active",
            index: true,
        },
        benefits: {
            type: [String],
            default: [],
        },

        documents: {
            type: [String],
            default: [],
        },

        tags: {
            type: [String],
            default: [],
            index: true,
        },

        states: {
            type: [String],
            default: [],
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const Scheme =
    models.Scheme || model<IScheme>("Scheme", SchemeSchema);

export default Scheme;