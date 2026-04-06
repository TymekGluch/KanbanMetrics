package utils

import (
	"cmp"
	"slices"
)

func UniqueMap[T comparable](list []T) map[T]struct{} {
	set := make(map[T]struct{})
	for _, item := range list {
		set[item] = struct{}{}
	}

	return set
}

func UniqueSlice[T cmp.Ordered](values []T) []T {
	if len(values) == 0 {
		return values
	}

	slices.Sort(values)

	uniqueIndex := 0

	for currentIndex := 1; currentIndex < len(values); currentIndex++ {
		if values[currentIndex] != values[uniqueIndex] {
			uniqueIndex++
			values[uniqueIndex] = values[currentIndex]
		}
	}

	return values[:uniqueIndex+1]
}
