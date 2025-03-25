A linked list is a [[Data Structure|data structure]] where element are stored in nodes that may point to the next element on the list. To find, update or delete a node one must start at the first element and visit each node until we hit the target. The nodes on a link list usually have a structure like:

```typescript
interface Node<T> {
	readonly element: T;
	next?: Node<T>;
}
```

Notice that there is no pointer to the previous node, which is what differentiates it from a [[Doubly Linked List]].