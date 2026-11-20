
#include <limits.h>
#include <stdint.h>
#include <stdio.h>

int main() {
    printf("int = signed %llu\n", (unsigned long long int)INT_MAX);
    printf("size_t = unsigned %llu\n", (unsigned long long int)SIZE_MAX);
    printf("ptrdiff_t = signed %llu\n", (unsigned long long int)PTRDIFF_MAX);
    printf("uintptr_t = unsigned %llu\n", (unsigned long long int)UINTPTR_MAX);
    return 0;
}
