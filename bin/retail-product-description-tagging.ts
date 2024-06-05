#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductDescriptionTaggingStack } from '../lib/retail-product-description-tagging-stack';

const app = new cdk.App();
new ProductDescriptionTaggingStack(app, 'ProductDescriptionTaggingStack');
