import type { CMSFilters } from './types/CMSFilters';
import type { Product, RootObject, Record, Fields } from './types';

const AIRTABLE_API_KEY =
  'patnJ0fyGVoolVpG3.9ec6315f9b214d4101c1ebd87dd7e19aa0bbc5e72c79ed158aaf4fb9075026b9';

const skeletonDiv = document.querySelectorAll('.skeleton-loader');

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const products = await fetchProducts();
    const productAirTable = await fetchProductsFromAirtable();

    // Remove existing items
    skeletonDiv.forEach((element) => element.parentNode?.removeChild(element));
    listInstance.clearItems();

    // Create the new items
    //const newItems = products.map((product) => createItem(product, itemTemplateElement));
    const newItems = productAirTable.map((product: any) =>
      createItem(product.fields, itemTemplateElement)
    );
    // Populate the list
    await listInstance.addItems(newItems);

    // Get the template filter
    const filterTemplateElement =
      filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="filter"]');
    if (!filterTemplateElement) return;

    // Get the parent wrapper
    const filtersWrapper = filterTemplateElement.parentElement;
    if (!filtersWrapper) return;

    // Remove the template from the DOM
    filterTemplateElement.remove();

    // Collect the categories

    const categories = collectCategories(productAirTable);
    // Create the new filters and append the to the parent wrapper
    for (const category of categories) {
      const newFilter = createFilter(category, filterTemplateElement);
      if (!newFilter) continue;

      filtersWrapper.append(newFilter);
    }

    // Sync the CMSFilters instance with the new created filters
    filtersInstance.storeFiltersData();
  },
]);

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */
const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data: Product[] = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

const fetchProductsFromAirtable = async () => {
  try {
    const response = await fetch('https://api.airtable.com/v0/appQgouIDjYLh8mko/Furniture', {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    const data: any = await response.json();
    return data.records;
  } catch (error) {
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param product The product data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (product: any, templateElement: HTMLDivElement) => {
  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;
  console.log(product);
  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="image"]');
  const title = newItem.querySelector<HTMLHeadingElement>('[data-element="title"]');
  const category = newItem.querySelector<HTMLDivElement>('[data-element="category"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const price = newItem.querySelector<HTMLDivElement>('[data-element="price"]');

  // Populate inner elements
  if (image) image.src = product.Images[0].url;
  if (title) title.textContent = product.Name;
  if (category) category.textContent = product.Category;
  if (description) description.textContent = product.Description;
  if (price) price.textContent = product.Price.toString();
  return newItem;
};

/**
 * Collects all the categories from the products' data.
 * @param products The products' data.
 *
 * @returns An array of {@link Product} categories.
 */

const collectCategories = (records: Record[]) => {
  const categories: Set<string> = new Set();

  for (const {
    fields: { Category },
  } of records) {
    categories.add(Category);
  }

  return [...categories];
};

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
const createFilter = (category: string, templateElement: HTMLLabelElement) => {
  // Clone the template element
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

  // Query inner elements
  const label = newFilter.querySelector('span');
  const radio = newFilter.querySelector('input');

  if (!label || !radio) return;

  // Populate inner elements
  label.textContent = category;
  radio.value = category;

  return newFilter;
};
