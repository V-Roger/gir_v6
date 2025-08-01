export interface RouteNode {
	name: string;
	path: string;
	href: string;
	children: Record<string, RouteNode>;
	isPage: boolean;
}

export interface FlatRoute {
	href: string;
	name: string;
	path: string;
	depth: number;
}

/**
 * Creates a routes tree from import.meta.glob result
 */
export function createRoutesTree(
	routeDefinitions: Record<string, { slug?: string; path: string; name?: string }>
): Record<string, RouteNode> {
	const routesTree: Record<string, RouteNode> = {};

	Object.entries(routeDefinitions).filter(([path]) => !path.includes('[slug]')).forEach(([path]) => {
		// Remove './' prefix and '/+page.svelte' suffix
		const cleanPath = path.replace(/^\.\//, '').replace('/+page.svelte', '');

		// Split path into segments
		const segments = cleanPath.split('/');

		// Build tree structure
		let currentLevel = routesTree;
		segments.forEach((segment, index) => {
			if (!currentLevel[segment]) {
				currentLevel[segment] = {
					name: routeDefinitions[path].name || segment,
					path: segments.slice(0, index + 1).join('/'),
					href: '/' + segments.slice(0, index + 1).join('/'),
					children: {},
					isPage: index === segments.length - 1
				};
			}
			currentLevel = currentLevel[segment].children;
		});
	});

	return routesTree;
}

/**
 * Converts routes tree to flat array for navigation
 */
export function flattenRoutesTree(routesTree: Record<string, RouteNode>): FlatRoute[] {
	const flatRoutes: FlatRoute[] = [];

	function traverse(node: RouteNode, depth: number = 0) {
		if (node.isPage) {
			flatRoutes.push({
				href: node.href,
				name: node.name.charAt(0).toUpperCase() + node.name.slice(1),
				path: node.path,
				depth
			});
		}

		Object.values(node.children).forEach((child) => {
			traverse(child, depth + 1);
		});
	}

	Object.values(routesTree).forEach((node) => {
		traverse(node);
	});

	return flatRoutes;
}
