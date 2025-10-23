<template>
  <div class="flex flex-col">
    <!-- Search and Filters -->
    <div class="mb-4 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search flairs..."
          class="form-input gray w-full"
        />
      </div>
      <div class="flex gap-2">
        <select v-model="filterType" class="form-select gray">
          <option value="all">All Types</option>
          <option value="post">Post Flairs</option>
          <option value="user">User Flairs</option>
        </select>
        <select v-model="filterStatus" class="form-select gray">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedFlairs.length > 0" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md flex items-center justify-between">
      <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
        {{ selectedFlairs.length }} flair{{ selectedFlairs.length !== 1 ? 's' : '' }} selected
      </span>
      <div class="flex gap-2">
        <button
          @click="$emit('bulkToggleActive', selectedFlairs)"
          class="button gray text-sm"
        >
          Toggle Active
        </button>
        <button
          @click="confirmBulkDelete"
          class="button red text-sm"
        >
          Delete Selected
        </button>
        <button
          @click="selectedFlairs = []"
          class="button gray text-sm"
        >
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-md shadow-sm">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-4 py-3 text-left w-12">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleAllSelection"
                class="rounded border-gray-300 dark:border-gray-700"
              />
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              :class="column.sortable ? 'select-none' : ''"
              @click="column.sortable && sortBy(column.key)"
            >
              <div class="flex items-center gap-2">
                {{ column.label }}
                <svg
                  v-if="column.sortable && sortColumn === column.key"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  :class="sortDirection === 'asc' ? '' : 'rotate-180'"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M6 15l6 -6l6 6" />
                </svg>
              </div>
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
          <tr
            v-for="flair in paginatedFlairs"
            :key="flair.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-900/50"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="selectedFlairs.includes(flair.id)"
                @change="toggleSelection(flair.id)"
                class="rounded border-gray-300 dark:border-gray-700"
              />
            </td>
            <td v-if="columns.find(c => c.key === 'preview' && !c.hidden)" class="px-4 py-3">
              <div
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :style="{
                  backgroundColor: flair.backgroundColor || '#e5e7eb',
                  color: flair.textColor || '#374151'
                }"
              >
                <svg
                  v-if="flair.icon"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  v-html="flair.icon"
                />
                {{ flair.displayText }}
              </div>
            </td>
            <td v-if="columns.find(c => c.key === 'name' && !c.hidden)" class="px-4 py-3">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900 dark:text-gray-100">{{ flair.name }}</span>
                <span v-if="flair.description" class="text-xs text-gray-500 dark:text-gray-400">{{ flair.description }}</span>
              </div>
            </td>
            <td v-if="columns.find(c => c.key === 'type' && !c.hidden)" class="px-4 py-3">
              <span
                class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                :class="flair.flairType === 'post' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'"
              >
                {{ flair.flairType === 'post' ? 'Post' : 'User' }}
              </span>
            </td>
            <td v-if="columns.find(c => c.key === 'category' && !c.hidden)" class="px-4 py-3">
              <span v-if="flair.category" class="text-sm text-gray-700 dark:text-gray-300">
                {{ flair.category.name }}
              </span>
              <span v-else class="text-sm text-gray-400 dark:text-gray-600">—</span>
            </td>
            <td v-if="columns.find(c => c.key === 'usage' && !c.hidden)" class="px-4 py-3">
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ flair.usageCount || 0 }}
              </span>
            </td>
            <td v-if="columns.find(c => c.key === 'status' && !c.hidden)" class="px-4 py-3">
              <button
                @click="$emit('toggleActive', flair)"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :class="flair.isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="flair.isActive ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="$emit('edit', flair)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                  </svg>
                </button>
                <button
                  @click="$emit('duplicate', flair)"
                  class="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                  title="Duplicate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(flair)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredFlairs.length === 0">
            <td :colspan="visibleColumns.length + 2" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <div class="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <p class="text-lg font-medium">No flairs found</p>
                <p class="text-sm">Try adjusting your search or filters</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, filteredFlairs.length) }} of {{ filteredFlairs.length }} flairs
      </div>
      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="button gray text-sm"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          class="button text-sm"
          :class="page === currentPage ? 'primary' : 'gray'"
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="button gray text-sm"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  flairs: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    default: () => [
      { key: 'preview', label: 'Preview', sortable: false },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'type', label: 'Type', sortable: true },
      { key: 'category', label: 'Category', sortable: true },
      { key: 'usage', label: 'Usage', sortable: true },
      { key: 'status', label: 'Active', sortable: true }
    ]
  },
  perPage: {
    type: Number,
    default: 25
  }
});

const emit = defineEmits(['edit', 'delete', 'duplicate', 'toggleActive', 'bulkDelete', 'bulkToggleActive']);

const searchQuery = ref('');
const filterType = ref('all');
const filterStatus = ref('all');
const sortColumn = ref('name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const selectedFlairs = ref([]);

const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden);
});

const filteredFlairs = computed(() => {
  let result = props.flairs;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(flair =>
      flair.name.toLowerCase().includes(query) ||
      flair.displayText?.toLowerCase().includes(query) ||
      flair.description?.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (filterType.value !== 'all') {
    result = result.filter(flair => flair.flairType === filterType.value);
  }

  // Status filter
  if (filterStatus.value !== 'all') {
    result = result.filter(flair =>
      filterStatus.value === 'active' ? flair.isActive : !flair.isActive
    );
  }

  // Sorting
  result.sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];

    // Handle nested properties (like category.name)
    if (sortColumn.value === 'category') {
      aVal = a.category?.name || '';
      bVal = b.category?.name || '';
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal?.toLowerCase() || '';
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return result;
});

const paginatedFlairs = computed(() => {
  const start = (currentPage.value - 1) * props.perPage;
  const end = start + props.perPage;
  return filteredFlairs.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredFlairs.value.length / props.perPage);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const allSelected = computed(() => {
  return paginatedFlairs.value.length > 0 &&
    paginatedFlairs.value.every(flair => selectedFlairs.value.includes(flair.id));
});

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const toggleSelection = (flairId) => {
  const index = selectedFlairs.value.indexOf(flairId);
  if (index > -1) {
    selectedFlairs.value.splice(index, 1);
  } else {
    selectedFlairs.value.push(flairId);
  }
};

const toggleAllSelection = () => {
  if (allSelected.value) {
    // Deselect all on current page
    paginatedFlairs.value.forEach(flair => {
      const index = selectedFlairs.value.indexOf(flair.id);
      if (index > -1) {
        selectedFlairs.value.splice(index, 1);
      }
    });
  } else {
    // Select all on current page
    paginatedFlairs.value.forEach(flair => {
      if (!selectedFlairs.value.includes(flair.id)) {
        selectedFlairs.value.push(flair.id);
      }
    });
  }
};

const confirmDelete = (flair) => {
  if (confirm(`Are you sure you want to delete the flair "${flair.name}"? This action cannot be undone.`)) {
    emit('delete', flair);
  }
};

const confirmBulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedFlairs.value.length} flair(s)? This action cannot be undone.`)) {
    emit('bulkDelete', selectedFlairs.value);
    selectedFlairs.value = [];
  }
};
</script>
