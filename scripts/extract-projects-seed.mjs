/**
 * Extracts hardcoded project text fields into admin-ready JSON seed.
 * Run: node scripts/extract-projects-seed.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../src/data/projects.js"), "utf8");

const start = src.indexOf("export const projectData = [");
const end = src.indexOf("];", start);
if (start < 0 || end < 0) throw new Error("Could not find projectData");

const body = src.slice(start + "export const projectData = ".length, end + 1);

function takeString(objSrc, key) {
  const re = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=,\\s*\\n\\s*(?:[a-z_]+):|\\n\\s*\\})`);
  const m = objSrc.match(re);
  if (!m) return "";
  let raw = m[1].trim();
  if (raw.startsWith('"') || raw.startsWith("'") || raw.startsWith("`")) {
    // Concatenated strings: "a"\n"b"
    const parts = [...raw.matchAll(/["'`]([\s\S]*?)["'`]/g)].map((x) => x[1]);
    return parts.join("").replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
  }
  return "";
}

function takeArrayStrings(objSrc, key) {
  const re = new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`);
  const m = objSrc.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}

const objects = [];
let depth = 0;
let buf = "";
let inObj = false;
for (let i = 0; i < body.length; i++) {
  const ch = body[i];
  if (ch === "{") {
    if (depth === 0) {
      inObj = true;
      buf = "{";
    } else buf += ch;
    depth++;
  } else if (ch === "}") {
    depth--;
    buf += ch;
    if (depth === 0 && inObj) {
      objects.push(buf);
      inObj = false;
      buf = "";
    }
  } else if (inObj) {
    buf += ch;
  }
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const projects = objects.map((obj, index) => {
  const id = takeString(obj, "id") || `project-${index + 1}`;
  const title = takeString(obj, "title");
  const categories = takeArrayStrings(obj, "category");
  const description = takeString(obj, "description");
  const details = takeString(obj, "details");
  const client = takeString(obj, "client");
  const area = takeString(obj, "area");
  const cost = takeString(obj, "cost");
  const status = takeString(obj, "status");
  const location = takeString(obj, "location");
  const scope = takeString(obj, "scope");
  const galleryVars = takeArrayStrings(obj, "gallery"); // variable names only

  return {
    slug: id,
    title,
    short_description: description,
    full_brief: details,
    cover_image_url: "", // upload via admin, then paste URL
    client,
    area,
    cost,
    status,
    location,
    scope,
    badge_tags: scope
      ? scope.split(",").map((t) => t.trim()).filter(Boolean)
      : categories.slice(0, 1),
    is_published: true,
    display_order: index,
    category_names: categories,
    gallery_image_count: galleryVars.length,
    gallery: [],
    notes: {
      local_cover_asset_hint: `Previously used local asset for id "${id}" — upload cover + ${galleryVars.length} gallery images in admin.`,
    },
  };
});

const categoryNames = [
  ...new Set(projects.flatMap((p) => p.category_names)),
];

const seed = {
  meta: {
    description:
      "Seed data mirrored from the old hardcoded portfolio. Create categories first, upload images in admin, then POST each project (replace cover_image_url / gallery URLs).",
    create_categories_first: categoryNames.map((name, i) => ({
      name,
      slug: slugify(name),
      display_order: i,
    })),
    api: {
      create_category: "POST /admin/project-categories",
      create_project: "POST /admin/projects",
      upload_image: "POST /admin/uploads/project-image",
      add_gallery: "POST /admin/projects/:id/gallery",
    },
    how_to_use: [
      "1. In Admin → Project Categories, create every entry in create_categories_first.",
      "2. Upload project images via Admin → Projects (cover + gallery).",
      "3. Create each project with matching fields; map category_names to category_ids from your API.",
      "4. badge_tags / scope values become the grey pill boxes on the project hero (e.g. ARCHITECTURE).",
    ],
  },
  projects,
};

const out = path.join(__dirname, "../src/data/admin-projects-seed.json");
fs.writeFileSync(out, JSON.stringify(seed, null, 2));
console.log(`Wrote ${projects.length} projects → ${out}`);
console.log(`Categories: ${categoryNames.join(", ")}`);
