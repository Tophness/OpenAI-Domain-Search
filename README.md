# Domain Rental Search - OpenAI ChatGPT Plugin

Unofficial [Domain](https://www.domain.com.au/) ChatGPT plugin to search Australian rental properties.

Includes proxy server to bypass CORS.

## Usage

To use this plugin you will need to be a ChatGPT Plus subscriber, and will also need access to the 'Install an unverified plugin' feature of the Plugin store.

You can then install the ChatGPT plugin using the following URL:

- https://openai-domain-search.onrender.com

## Development

To run the plugin locally:

First make sure to update the following files to use local URLs:

```diff
diff --git a/public/.well-known/ai-plugin.json b/public/.well-known/ai-plugin.json
index 1c61339..e9fba39 100644
--- a/public/.well-known/ai-plugin.json
+++ b/public/.well-known/ai-plugin.json
@@ -1,6 +1,6 @@
 {
     "schema_version": "v1",
-    "name_for_human": "Domain Plugin",
+    "name_for_human": "Domain Plugin (Local)",
     "name_for_model": "rent",
     "description_for_human": "Plugin for finding apartments to rent.",
     "description_for_model": "Plugin for finding apartments to rent.",
@@ -9,9 +9,9 @@
     },
     "api": {
         "type": "openapi",
-        "url": "https://openai-domain-search.onrender.com/openapi.yaml"
+        "url": "http://localhost:3333/openapi.yaml"
     },
-    "logo_url": "https://openai-domain-search.onrender.com/logo.png",
+    "logo_url": "http://localhost:3333/logo.png",
     "contact_email": "support@example.com",
     "legal_info_url": "http://www.example.com/legal"
 }
diff --git a/public/openapi.yaml b/public/openapi.yaml
index fbdecfa..24b270b 100644
--- a/public/openapi.yaml
+++ b/public/openapi.yaml
@@ -4,7 +4,7 @@ info:
   description: A plugin that allows the user to search for an ideal apartment using ChatGPT.
   version: 'v1'
 servers:
-  - url: https://openai-domain-search.onrender.com
+  - url: http://localhost:3333
 paths:
   /rent/:
     get:
```

Then:

- Copy the `.env.example` file to `.env` and fill in the required values
  - Make sure to set `BIND_HOST` and `BIND_PORT` to appropriate values for local development 
- Then you need to install the dependencies: `npm install`
- Then you can start the proxy server: `npm start`

Once the server is running, you can install it in ChatGPT using the 'Develop your own plugin' feature of the Plugin store.
