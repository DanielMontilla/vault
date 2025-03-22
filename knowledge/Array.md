An array is a [[Data Structure|data structure]] consisting of a collection of elements accessed via a positive integer *index*. Arrays are often used to implement other data structures. Generally, an array is defined by the internal elements type and its fixed length.

To access an element *n* we do the following:
memory address of the array + size of element * index of `n`

This computation is inexpensive; as a result arrays are very performant.
## Dynamic/Resizable Arrays
Resizable arrays are far more flexible because they are able to dynamically change its length, so its size does not necessarily have to be declared up front. However, this feature does introduce some complexity and could degrade its performant access scheme. Often these types of arrays are called [[List]] or `Vector`