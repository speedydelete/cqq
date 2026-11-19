
#include <stddef.h>
#include <limits.h>
#include <stdio.h>

#if __STDC_VERSION__ >= 199901L
    #define C99 1
    #include <stdbool.h>
    #include <stdint.h>
    #define get_bits(max) ((max) /((max)%0x3fffffffULL+1) / 0x3fffffffULL %0x3fffffffULL * 30 + (max)%0x3fffffffULL /((max) % 31 + 1)/31 % 31 * 5 + 4 - 12/((max) % 31 + 3))
#else
    #define get_bits(max) ((max) /((max)%0x3fffffffUL+1) / 0x3fffffffUL %0x3fffffffUL * 30 + (max)%0x3fffffffUL /((max) % 31 + 1)/31 % 31 * 5 + 4 - 12/((max) % 31 + 3))
#endif

#ifndef offsetof
    #define offsetof(type, member) ((long int)&(((type*)0)->member))
#endif

#define alignof_polyfill(T) offsetof(struct{ char c; T member; }, member)

#define print_value(x) printf("value "#x" = %li\n", (long int)x)
#define print_type_info(T, bits) printf("type "#T": size = %li, align = %li, bits = %li\n", (long int)sizeof(T), (long int)alignof_polyfill(T), (long int)bits)

void print_intN_t_info(void);
void print_uintN_t_info(void);

int main(int argc, char* argv[]) {
    argv[argc - 1]++;
    #ifndef CHAR_BIT
        #error "No CHAR_BIT is present"
    #endif
    print_value(CHAR_BIT);
    #ifdef __STDC__
        print_value(__STDC__);
    #endif
    #ifdef __STDC_HOSTED__
        print_value(__STDC_HOSTED__);
    #endif
    #ifdef __STDC_VERSION__
        print_value(__STDC_VERSION__);
    #endif
    #if C99
        print_type_info(bool, 1);
    #endif
    print_type_info(char, CHAR_BIT);
    print_type_info(signed char, CHAR_BIT);
    print_type_info(unsigned char, CHAR_BIT);
    #ifdef SHRT_MAX
        print_type_info(short int, get_bits(SHRT_MAX) + 1);
    #endif
    #ifdef USHRT_MAX
        print_type_info(unsigned short int, get_bits(USHRT_MAX));
    #endif
    #ifdef INT_MAX
        print_type_info(int, get_bits(INT_MAX) + 1);
    #endif
    #ifdef UINT_MAX
        print_type_info(unsigned int, get_bits(UINT_MAX));
    #endif
    #ifdef LONG_MAX
        print_type_info(long int, get_bits(LONG_MAX) + 1);
    #endif
    #ifdef ULONG_MAX
        print_type_info(unsigned long int, get_bits(ULONG_MAX));
    #endif
    #ifdef LLONG_MAX
        print_type_info(long long int, get_bits(LLONG_MAX));
    #endif
    #ifdef ULLONG_MAX
        print_type_info(unsigned long long int, get_bits(ULLONG_MAX));
    #endif
    print_type_info(float, sizeof(float) * CHAR_BIT);
    print_type_info(double, sizeof(double) * CHAR_BIT);
    print_type_info(char*, sizeof(char*) * CHAR_BIT);
    #ifdef SIZE_MAX
        print_type_info(size_t, get_bits(SIZE_MAX));
    #endif
    #ifdef PTRDIFF_MAX
        print_type_info(ptrdiff_t, get_bits(PTRDIFF_MAX) + 1);
    #endif
    #if __STDC_VERSION__ >= 201112L
        print_type_info(max_align_t, sizeof(max_align_t) * CHAR_BIT);
    #endif
    #ifdef INTPTR_MAX
        print_type_info(intptr_t, get_bits(INTPTR_MAX) + 1);
    #endif
    #ifdef UINTPTR_MAX
        print_type_info(uintptr_t, get_bits(UINTPTR_MAX));
    #endif
    print_intN_t_info();
    print_uintN_t_info();
    return 0;
}

void print_intN_t_info(void) {
    #ifdef INT1_MAX
        print_type_info(int1_t, get_bits(INT1_MAX) + 1);
    #endif
    #ifdef INT2_MAX
        print_type_info(int2_t, get_bits(INT2_MAX) + 1);
    #endif
    #ifdef INT3_MAX
        print_type_info(int3_t, get_bits(INT3_MAX) + 1);
    #endif
    #ifdef INT4_MAX
        print_type_info(int4_t, get_bits(INT4_MAX) + 1);
    #endif
    #ifdef INT5_MAX
        print_type_info(int5_t, get_bits(INT5_MAX) + 1);
    #endif
    #ifdef INT6_MAX
        print_type_info(int6_t, get_bits(INT6_MAX) + 1);
    #endif
    #ifdef INT7_MAX
        print_type_info(int7_t, get_bits(INT7_MAX) + 1);
    #endif
    #ifdef INT8_MAX
        print_type_info(int8_t, get_bits(INT8_MAX) + 1);
    #endif
    #ifdef INT9_MAX
        print_type_info(int9_t, get_bits(INT9_MAX) + 1);
    #endif
    #ifdef INT10_MAX
        print_type_info(int10_t, get_bits(INT10_MAX) + 1);
    #endif
    #ifdef INT11_MAX
        print_type_info(int11_t, get_bits(INT11_MAX) + 1);
    #endif
    #ifdef INT12_MAX
        print_type_info(int12_t, get_bits(INT12_MAX) + 1);
    #endif
    #ifdef INT13_MAX
        print_type_info(int13_t, get_bits(INT13_MAX) + 1);
    #endif
    #ifdef INT14_MAX
        print_type_info(int14_t, get_bits(INT14_MAX) + 1);
    #endif
    #ifdef INT15_MAX
        print_type_info(int15_t, get_bits(INT15_MAX) + 1);
    #endif
    #ifdef INT16_MAX
        print_type_info(int16_t, get_bits(INT16_MAX) + 1);
    #endif
    #ifdef INT17_MAX
        print_type_info(int17_t, get_bits(INT17_MAX) + 1);
    #endif
    #ifdef INT18_MAX
        print_type_info(int18_t, get_bits(INT18_MAX) + 1);
    #endif
    #ifdef INT19_MAX
        print_type_info(int19_t, get_bits(INT19_MAX) + 1);
    #endif
    #ifdef INT20_MAX
        print_type_info(int20_t, get_bits(INT20_MAX) + 1);
    #endif
    #ifdef INT21_MAX
        print_type_info(int21_t, get_bits(INT21_MAX) + 1);
    #endif
    #ifdef INT22_MAX
        print_type_info(int22_t, get_bits(INT22_MAX) + 1);
    #endif
    #ifdef INT23_MAX
        print_type_info(int23_t, get_bits(INT23_MAX) + 1);
    #endif
    #ifdef INT24_MAX
        print_type_info(int24_t, get_bits(INT24_MAX) + 1);
    #endif
    #ifdef INT25_MAX
        print_type_info(int25_t, get_bits(INT25_MAX) + 1);
    #endif
    #ifdef INT26_MAX
        print_type_info(int26_t, get_bits(INT26_MAX) + 1);
    #endif
    #ifdef INT27_MAX
        print_type_info(int27_t, get_bits(INT27_MAX) + 1);
    #endif
    #ifdef INT28_MAX
        print_type_info(int28_t, get_bits(INT28_MAX) + 1);
    #endif
    #ifdef INT29_MAX
        print_type_info(int29_t, get_bits(INT29_MAX) + 1);
    #endif
    #ifdef INT30_MAX
        print_type_info(int30_t, get_bits(INT30_MAX) + 1);
    #endif
    #ifdef INT31_MAX
        print_type_info(int31_t, get_bits(INT31_MAX) + 1);
    #endif
    #ifdef INT32_MAX
        print_type_info(int32_t, get_bits(INT32_MAX) + 1);
    #endif
    #ifdef INT33_MAX
        print_type_info(int33_t, get_bits(INT33_MAX) + 1);
    #endif
    #ifdef INT34_MAX
        print_type_info(int34_t, get_bits(INT34_MAX) + 1);
    #endif
    #ifdef INT35_MAX
        print_type_info(int35_t, get_bits(INT35_MAX) + 1);
    #endif
    #ifdef INT36_MAX
        print_type_info(int36_t, get_bits(INT36_MAX) + 1);
    #endif
    #ifdef INT37_MAX
        print_type_info(int37_t, get_bits(INT37_MAX) + 1);
    #endif
    #ifdef INT38_MAX
        print_type_info(int38_t, get_bits(INT38_MAX) + 1);
    #endif
    #ifdef INT39_MAX
        print_type_info(int39_t, get_bits(INT39_MAX) + 1);
    #endif
    #ifdef INT40_MAX
        print_type_info(int40_t, get_bits(INT40_MAX) + 1);
    #endif
    #ifdef INT41_MAX
        print_type_info(int41_t, get_bits(INT41_MAX) + 1);
    #endif
    #ifdef INT42_MAX
        print_type_info(int42_t, get_bits(INT42_MAX) + 1);
    #endif
    #ifdef INT43_MAX
        print_type_info(int43_t, get_bits(INT43_MAX) + 1);
    #endif
    #ifdef INT44_MAX
        print_type_info(int44_t, get_bits(INT44_MAX) + 1);
    #endif
    #ifdef INT45_MAX
        print_type_info(int45_t, get_bits(INT45_MAX) + 1);
    #endif
    #ifdef INT46_MAX
        print_type_info(int46_t, get_bits(INT46_MAX) + 1);
    #endif
    #ifdef INT47_MAX
        print_type_info(int47_t, get_bits(INT47_MAX) + 1);
    #endif
    #ifdef INT48_MAX
        print_type_info(int48_t, get_bits(INT48_MAX) + 1);
    #endif
    #ifdef INT49_MAX
        print_type_info(int49_t, get_bits(INT49_MAX) + 1);
    #endif
    #ifdef INT50_MAX
        print_type_info(int50_t, get_bits(INT50_MAX) + 1);
    #endif
    #ifdef INT51_MAX
        print_type_info(int51_t, get_bits(INT51_MAX) + 1);
    #endif
    #ifdef INT52_MAX
        print_type_info(int52_t, get_bits(INT52_MAX) + 1);
    #endif
    #ifdef INT53_MAX
        print_type_info(int53_t, get_bits(INT53_MAX) + 1);
    #endif
    #ifdef INT54_MAX
        print_type_info(int54_t, get_bits(INT54_MAX) + 1);
    #endif
    #ifdef INT55_MAX
        print_type_info(int55_t, get_bits(INT55_MAX) + 1);
    #endif
    #ifdef INT56_MAX
        print_type_info(int56_t, get_bits(INT56_MAX) + 1);
    #endif
    #ifdef INT57_MAX
        print_type_info(int57_t, get_bits(INT57_MAX) + 1);
    #endif
    #ifdef INT58_MAX
        print_type_info(int58_t, get_bits(INT58_MAX) + 1);
    #endif
    #ifdef INT59_MAX
        print_type_info(int59_t, get_bits(INT59_MAX) + 1);
    #endif
    #ifdef INT60_MAX
        print_type_info(int60_t, get_bits(INT60_MAX) + 1);
    #endif
    #ifdef INT61_MAX
        print_type_info(int61_t, get_bits(INT61_MAX) + 1);
    #endif
    #ifdef INT62_MAX
        print_type_info(int62_t, get_bits(INT62_MAX) + 1);
    #endif
    #ifdef INT63_MAX
        print_type_info(int63_t, get_bits(INT63_MAX) + 1);
    #endif
    #ifdef INT64_MAX
        print_type_info(int64_t, get_bits(INT64_MAX) + 1);
    #endif
    #ifdef INT65_MAX
        print_type_info(int65_t, get_bits(INT65_MAX) + 1);
    #endif
    #ifdef INT66_MAX
        print_type_info(int66_t, get_bits(INT66_MAX) + 1);
    #endif
    #ifdef INT67_MAX
        print_type_info(int67_t, get_bits(INT67_MAX) + 1);
    #endif
    #ifdef INT68_MAX
        print_type_info(int68_t, get_bits(INT68_MAX) + 1);
    #endif
    #ifdef INT69_MAX
        print_type_info(int69_t, get_bits(INT69_MAX) + 1);
    #endif
    #ifdef INT70_MAX
        print_type_info(int70_t, get_bits(INT70_MAX) + 1);
    #endif
    #ifdef INT71_MAX
        print_type_info(int71_t, get_bits(INT71_MAX) + 1);
    #endif
    #ifdef INT72_MAX
        print_type_info(int72_t, get_bits(INT72_MAX) + 1);
    #endif
    #ifdef INT73_MAX
        print_type_info(int73_t, get_bits(INT73_MAX) + 1);
    #endif
    #ifdef INT74_MAX
        print_type_info(int74_t, get_bits(INT74_MAX) + 1);
    #endif
    #ifdef INT75_MAX
        print_type_info(int75_t, get_bits(INT75_MAX) + 1);
    #endif
    #ifdef INT76_MAX
        print_type_info(int76_t, get_bits(INT76_MAX) + 1);
    #endif
    #ifdef INT77_MAX
        print_type_info(int77_t, get_bits(INT77_MAX) + 1);
    #endif
    #ifdef INT78_MAX
        print_type_info(int78_t, get_bits(INT78_MAX) + 1);
    #endif
    #ifdef INT79_MAX
        print_type_info(int79_t, get_bits(INT79_MAX) + 1);
    #endif
    #ifdef INT80_MAX
        print_type_info(int80_t, get_bits(INT80_MAX) + 1);
    #endif
    #ifdef INT81_MAX
        print_type_info(int81_t, get_bits(INT81_MAX) + 1);
    #endif
    #ifdef INT82_MAX
        print_type_info(int82_t, get_bits(INT82_MAX) + 1);
    #endif
    #ifdef INT83_MAX
        print_type_info(int83_t, get_bits(INT83_MAX) + 1);
    #endif
    #ifdef INT84_MAX
        print_type_info(int84_t, get_bits(INT84_MAX) + 1);
    #endif
    #ifdef INT85_MAX
        print_type_info(int85_t, get_bits(INT85_MAX) + 1);
    #endif
    #ifdef INT86_MAX
        print_type_info(int86_t, get_bits(INT86_MAX) + 1);
    #endif
    #ifdef INT87_MAX
        print_type_info(int87_t, get_bits(INT87_MAX) + 1);
    #endif
    #ifdef INT88_MAX
        print_type_info(int88_t, get_bits(INT88_MAX) + 1);
    #endif
    #ifdef INT89_MAX
        print_type_info(int89_t, get_bits(INT89_MAX) + 1);
    #endif
    #ifdef INT90_MAX
        print_type_info(int90_t, get_bits(INT90_MAX) + 1);
    #endif
    #ifdef INT91_MAX
        print_type_info(int91_t, get_bits(INT91_MAX) + 1);
    #endif
    #ifdef INT92_MAX
        print_type_info(int92_t, get_bits(INT92_MAX) + 1);
    #endif
    #ifdef INT93_MAX
        print_type_info(int93_t, get_bits(INT93_MAX) + 1);
    #endif
    #ifdef INT94_MAX
        print_type_info(int94_t, get_bits(INT94_MAX) + 1);
    #endif
    #ifdef INT95_MAX
        print_type_info(int95_t, get_bits(INT95_MAX) + 1);
    #endif
    #ifdef INT96_MAX
        print_type_info(int96_t, get_bits(INT96_MAX) + 1);
    #endif
    #ifdef INT97_MAX
        print_type_info(int97_t, get_bits(INT97_MAX) + 1);
    #endif
    #ifdef INT98_MAX
        print_type_info(int98_t, get_bits(INT98_MAX) + 1);
    #endif
    #ifdef INT99_MAX
        print_type_info(int99_t, get_bits(INT99_MAX) + 1);
    #endif
    #ifdef INT100_MAX
        print_type_info(int100_t, get_bits(INT100_MAX) + 1);
    #endif
    #ifdef INT101_MAX
        print_type_info(int101_t, get_bits(INT101_MAX) + 1);
    #endif
    #ifdef INT102_MAX
        print_type_info(int102_t, get_bits(INT102_MAX) + 1);
    #endif
    #ifdef INT103_MAX
        print_type_info(int103_t, get_bits(INT103_MAX) + 1);
    #endif
    #ifdef INT104_MAX
        print_type_info(int104_t, get_bits(INT104_MAX) + 1);
    #endif
    #ifdef INT105_MAX
        print_type_info(int105_t, get_bits(INT105_MAX) + 1);
    #endif
    #ifdef INT106_MAX
        print_type_info(int106_t, get_bits(INT106_MAX) + 1);
    #endif
    #ifdef INT107_MAX
        print_type_info(int107_t, get_bits(INT107_MAX) + 1);
    #endif
    #ifdef INT108_MAX
        print_type_info(int108_t, get_bits(INT108_MAX) + 1);
    #endif
    #ifdef INT109_MAX
        print_type_info(int109_t, get_bits(INT109_MAX) + 1);
    #endif
    #ifdef INT110_MAX
        print_type_info(int110_t, get_bits(INT110_MAX) + 1);
    #endif
    #ifdef INT111_MAX
        print_type_info(int111_t, get_bits(INT111_MAX) + 1);
    #endif
    #ifdef INT112_MAX
        print_type_info(int112_t, get_bits(INT112_MAX) + 1);
    #endif
    #ifdef INT113_MAX
        print_type_info(int113_t, get_bits(INT113_MAX) + 1);
    #endif
    #ifdef INT114_MAX
        print_type_info(int114_t, get_bits(INT114_MAX) + 1);
    #endif
    #ifdef INT115_MAX
        print_type_info(int115_t, get_bits(INT115_MAX) + 1);
    #endif
    #ifdef INT116_MAX
        print_type_info(int116_t, get_bits(INT116_MAX) + 1);
    #endif
    #ifdef INT117_MAX
        print_type_info(int117_t, get_bits(INT117_MAX) + 1);
    #endif
    #ifdef INT118_MAX
        print_type_info(int118_t, get_bits(INT118_MAX) + 1);
    #endif
    #ifdef INT119_MAX
        print_type_info(int119_t, get_bits(INT119_MAX) + 1);
    #endif
    #ifdef INT120_MAX
        print_type_info(int120_t, get_bits(INT120_MAX) + 1);
    #endif
    #ifdef INT121_MAX
        print_type_info(int121_t, get_bits(INT121_MAX) + 1);
    #endif
    #ifdef INT122_MAX
        print_type_info(int122_t, get_bits(INT122_MAX) + 1);
    #endif
    #ifdef INT123_MAX
        print_type_info(int123_t, get_bits(INT123_MAX) + 1);
    #endif
    #ifdef INT124_MAX
        print_type_info(int124_t, get_bits(INT124_MAX) + 1);
    #endif
    #ifdef INT125_MAX
        print_type_info(int125_t, get_bits(INT125_MAX) + 1);
    #endif
    #ifdef INT126_MAX
        print_type_info(int126_t, get_bits(INT126_MAX) + 1);
    #endif
    #ifdef INT127_MAX
        print_type_info(int127_t, get_bits(INT127_MAX) + 1);
    #endif
    #ifdef INT128_MAX
        print_type_info(int128_t, get_bits(INT127_MAX) + 1);
    #endif
}

void print_uintN_t_info(void) {
    #ifdef UINT1_MAX
        print_type_info(uint1_t, get_bits(UINT1_MAX));
    #endif
    #ifdef UINT2_MAX
        print_type_info(uint2_t, get_bits(UINT2_MAX));
    #endif
    #ifdef UINT3_MAX
        print_type_info(uint3_t, get_bits(UINT3_MAX));
    #endif
    #ifdef UINT4_MAX
        print_type_info(uint4_t, get_bits(UINT4_MAX));
    #endif
    #ifdef UINT5_MAX
        print_type_info(uint5_t, get_bits(UINT5_MAX));
    #endif
    #ifdef UINT6_MAX
        print_type_info(uint6_t, get_bits(UINT6_MAX));
    #endif
    #ifdef UINT7_MAX
        print_type_info(uint7_t, get_bits(UINT7_MAX));
    #endif
    #ifdef UINT8_MAX
        print_type_info(uint8_t, get_bits(UINT8_MAX));
    #endif
    #ifdef UINT9_MAX
        print_type_info(uint9_t, get_bits(UINT9_MAX));
    #endif
    #ifdef UINT10_MAX
        print_type_info(uint10_t, get_bits(UINT10_MAX));
    #endif
    #ifdef UINT11_MAX
        print_type_info(uint11_t, get_bits(UINT11_MAX));
    #endif
    #ifdef UINT12_MAX
        print_type_info(uint12_t, get_bits(UINT12_MAX));
    #endif
    #ifdef UINT13_MAX
        print_type_info(uint13_t, get_bits(UINT13_MAX));
    #endif
    #ifdef UINT14_MAX
        print_type_info(uint14_t, get_bits(UINT14_MAX));
    #endif
    #ifdef UINT15_MAX
        print_type_info(uint15_t, get_bits(UINT15_MAX));
    #endif
    #ifdef UINT16_MAX
        print_type_info(uint16_t, get_bits(UINT16_MAX));
    #endif
    #ifdef UINT17_MAX
        print_type_info(uint17_t, get_bits(UINT17_MAX));
    #endif
    #ifdef UINT18_MAX
        print_type_info(uint18_t, get_bits(UINT18_MAX));
    #endif
    #ifdef UINT19_MAX
        print_type_info(uint19_t, get_bits(UINT19_MAX));
    #endif
    #ifdef UINT20_MAX
        print_type_info(uint20_t, get_bits(UINT20_MAX));
    #endif
    #ifdef UINT21_MAX
        print_type_info(uint21_t, get_bits(UINT21_MAX));
    #endif
    #ifdef UINT22_MAX
        print_type_info(uint22_t, get_bits(UINT22_MAX));
    #endif
    #ifdef UINT23_MAX
        print_type_info(uint23_t, get_bits(UINT23_MAX));
    #endif
    #ifdef UINT24_MAX
        print_type_info(uint24_t, get_bits(UINT24_MAX));
    #endif
    #ifdef UINT25_MAX
        print_type_info(uint25_t, get_bits(UINT25_MAX));
    #endif
    #ifdef UINT26_MAX
        print_type_info(uint26_t, get_bits(UINT26_MAX));
    #endif
    #ifdef UINT27_MAX
        print_type_info(uint27_t, get_bits(UINT27_MAX));
    #endif
    #ifdef UINT28_MAX
        print_type_info(uint28_t, get_bits(UINT28_MAX));
    #endif
    #ifdef UINT29_MAX
        print_type_info(uint29_t, get_bits(UINT29_MAX));
    #endif
    #ifdef UINT30_MAX
        print_type_info(uint30_t, get_bits(UINT30_MAX));
    #endif
    #ifdef UINT31_MAX
        print_type_info(uint31_t, get_bits(UINT31_MAX));
    #endif
    #ifdef UINT32_MAX
        print_type_info(uint32_t, get_bits(UINT32_MAX));
    #endif
    #ifdef UINT33_MAX
        print_type_info(uint33_t, get_bits(UINT33_MAX));
    #endif
    #ifdef UINT34_MAX
        print_type_info(uint34_t, get_bits(UINT34_MAX));
    #endif
    #ifdef UINT35_MAX
        print_type_info(uint35_t, get_bits(UINT35_MAX));
    #endif
    #ifdef UINT36_MAX
        print_type_info(uint36_t, get_bits(UINT36_MAX));
    #endif
    #ifdef UINT37_MAX
        print_type_info(uint37_t, get_bits(UINT37_MAX));
    #endif
    #ifdef UINT38_MAX
        print_type_info(uint38_t, get_bits(UINT38_MAX));
    #endif
    #ifdef UINT39_MAX
        print_type_info(uint39_t, get_bits(UINT39_MAX));
    #endif
    #ifdef UINT40_MAX
        print_type_info(uint40_t, get_bits(UINT40_MAX));
    #endif
    #ifdef UINT41_MAX
        print_type_info(uint41_t, get_bits(UINT41_MAX));
    #endif
    #ifdef UINT42_MAX
        print_type_info(uint42_t, get_bits(UINT42_MAX));
    #endif
    #ifdef UINT43_MAX
        print_type_info(uint43_t, get_bits(UINT43_MAX));
    #endif
    #ifdef UINT44_MAX
        print_type_info(uint44_t, get_bits(UINT44_MAX));
    #endif
    #ifdef UINT45_MAX
        print_type_info(uint45_t, get_bits(UINT45_MAX));
    #endif
    #ifdef UINT46_MAX
        print_type_info(uint46_t, get_bits(UINT46_MAX));
    #endif
    #ifdef UINT47_MAX
        print_type_info(uint47_t, get_bits(UINT47_MAX));
    #endif
    #ifdef UINT48_MAX
        print_type_info(uint48_t, get_bits(UINT48_MAX));
    #endif
    #ifdef UINT49_MAX
        print_type_info(uint49_t, get_bits(UINT49_MAX));
    #endif
    #ifdef UINT50_MAX
        print_type_info(uint50_t, get_bits(UINT50_MAX));
    #endif
    #ifdef UINT51_MAX
        print_type_info(uint51_t, get_bits(UINT51_MAX));
    #endif
    #ifdef UINT52_MAX
        print_type_info(uint52_t, get_bits(UINT52_MAX));
    #endif
    #ifdef UINT53_MAX
        print_type_info(uint53_t, get_bits(UINT53_MAX));
    #endif
    #ifdef UINT54_MAX
        print_type_info(uint54_t, get_bits(UINT54_MAX));
    #endif
    #ifdef UINT55_MAX
        print_type_info(uint55_t, get_bits(UINT55_MAX));
    #endif
    #ifdef UINT56_MAX
        print_type_info(uint56_t, get_bits(UINT56_MAX));
    #endif
    #ifdef UINT57_MAX
        print_type_info(uint57_t, get_bits(UINT57_MAX));
    #endif
    #ifdef UINT58_MAX
        print_type_info(uint58_t, get_bits(UINT58_MAX));
    #endif
    #ifdef UINT59_MAX
        print_type_info(uint59_t, get_bits(UINT59_MAX));
    #endif
    #ifdef UINT60_MAX
        print_type_info(uint60_t, get_bits(UINT60_MAX));
    #endif
    #ifdef UINT61_MAX
        print_type_info(uint61_t, get_bits(UINT61_MAX));
    #endif
    #ifdef UINT62_MAX
        print_type_info(uint62_t, get_bits(UINT62_MAX));
    #endif
    #ifdef UINT63_MAX
        print_type_info(uint63_t, get_bits(UINT63_MAX));
    #endif
    #ifdef UINT64_MAX
        print_type_info(uint64_t, get_bits(UINT64_MAX));
    #endif
    #ifdef UINT65_MAX
        print_type_info(uint65_t, get_bits(UINT65_MAX));
    #endif
    #ifdef UINT66_MAX
        print_type_info(uint66_t, get_bits(UINT66_MAX));
    #endif
    #ifdef UINT67_MAX
        print_type_info(uint67_t, get_bits(UINT67_MAX));
    #endif
    #ifdef UINT68_MAX
        print_type_info(uint68_t, get_bits(UINT68_MAX));
    #endif
    #ifdef UINT69_MAX
        print_type_info(uint69_t, get_bits(UINT69_MAX));
    #endif
    #ifdef UINT70_MAX
        print_type_info(uint70_t, get_bits(UINT70_MAX));
    #endif
    #ifdef UINT71_MAX
        print_type_info(uint71_t, get_bits(UINT71_MAX));
    #endif
    #ifdef UINT72_MAX
        print_type_info(uint72_t, get_bits(UINT72_MAX));
    #endif
    #ifdef UINT73_MAX
        print_type_info(uint73_t, get_bits(UINT73_MAX));
    #endif
    #ifdef UINT74_MAX
        print_type_info(uint74_t, get_bits(UINT74_MAX));
    #endif
    #ifdef UINT75_MAX
        print_type_info(uint75_t, get_bits(UINT75_MAX));
    #endif
    #ifdef UINT76_MAX
        print_type_info(uint76_t, get_bits(UINT76_MAX));
    #endif
    #ifdef UINT77_MAX
        print_type_info(uint77_t, get_bits(UINT77_MAX));
    #endif
    #ifdef UINT78_MAX
        print_type_info(uint78_t, get_bits(UINT78_MAX));
    #endif
    #ifdef UINT79_MAX
        print_type_info(uint79_t, get_bits(UINT79_MAX));
    #endif
    #ifdef UINT80_MAX
        print_type_info(uint80_t, get_bits(UINT80_MAX));
    #endif
    #ifdef UINT81_MAX
        print_type_info(uint81_t, get_bits(UINT81_MAX));
    #endif
    #ifdef UINT82_MAX
        print_type_info(uint82_t, get_bits(UINT82_MAX));
    #endif
    #ifdef UINT83_MAX
        print_type_info(uint83_t, get_bits(UINT83_MAX));
    #endif
    #ifdef UINT84_MAX
        print_type_info(uint84_t, get_bits(UINT84_MAX));
    #endif
    #ifdef UINT85_MAX
        print_type_info(uint85_t, get_bits(UINT85_MAX));
    #endif
    #ifdef UINT86_MAX
        print_type_info(uint86_t, get_bits(UINT86_MAX));
    #endif
    #ifdef UINT87_MAX
        print_type_info(uint87_t, get_bits(UINT87_MAX));
    #endif
    #ifdef UINT88_MAX
        print_type_info(uint88_t, get_bits(UINT88_MAX));
    #endif
    #ifdef UINT89_MAX
        print_type_info(uint89_t, get_bits(UINT89_MAX));
    #endif
    #ifdef UINT90_MAX
        print_type_info(uint90_t, get_bits(UINT90_MAX));
    #endif
    #ifdef UINT91_MAX
        print_type_info(uint91_t, get_bits(UINT91_MAX));
    #endif
    #ifdef UINT92_MAX
        print_type_info(uint92_t, get_bits(UINT92_MAX));
    #endif
    #ifdef UINT93_MAX
        print_type_info(uint93_t, get_bits(UINT93_MAX));
    #endif
    #ifdef UINT94_MAX
        print_type_info(uint94_t, get_bits(UINT94_MAX));
    #endif
    #ifdef UINT95_MAX
        print_type_info(uint95_t, get_bits(UINT95_MAX));
    #endif
    #ifdef UINT96_MAX
        print_type_info(uint96_t, get_bits(UINT96_MAX));
    #endif
    #ifdef UINT97_MAX
        print_type_info(uint97_t, get_bits(UINT97_MAX));
    #endif
    #ifdef UINT98_MAX
        print_type_info(uint98_t, get_bits(UINT98_MAX));
    #endif
    #ifdef UINT99_MAX
        print_type_info(uint99_t, get_bits(UINT99_MAX));
    #endif
    #ifdef UINT100_MAX
        print_type_info(uint100_t, get_bits(UINT100_MAX));
    #endif
    #ifdef UINT101_MAX
        print_type_info(uint101_t, get_bits(UINT101_MAX));
    #endif
    #ifdef UINT102_MAX
        print_type_info(uint102_t, get_bits(UINT102_MAX));
    #endif
    #ifdef UINT103_MAX
        print_type_info(uint103_t, get_bits(UINT103_MAX));
    #endif
    #ifdef UINT104_MAX
        print_type_info(uint104_t, get_bits(UINT104_MAX));
    #endif
    #ifdef UINT105_MAX
        print_type_info(uint105_t, get_bits(UINT105_MAX));
    #endif
    #ifdef UINT106_MAX
        print_type_info(uint106_t, get_bits(UINT106_MAX));
    #endif
    #ifdef UINT107_MAX
        print_type_info(uint107_t, get_bits(UINT107_MAX));
    #endif
    #ifdef UINT108_MAX
        print_type_info(uint108_t, get_bits(UINT108_MAX));
    #endif
    #ifdef UINT109_MAX
        print_type_info(uint109_t, get_bits(UINT109_MAX));
    #endif
    #ifdef UINT110_MAX
        print_type_info(uint110_t, get_bits(UINT110_MAX));
    #endif
    #ifdef UINT111_MAX
        print_type_info(uint111_t, get_bits(UINT111_MAX));
    #endif
    #ifdef UINT112_MAX
        print_type_info(uint112_t, get_bits(UINT112_MAX));
    #endif
    #ifdef UINT113_MAX
        print_type_info(uint113_t, get_bits(UINT113_MAX));
    #endif
    #ifdef UINT114_MAX
        print_type_info(uint114_t, get_bits(UINT114_MAX));
    #endif
    #ifdef UINT115_MAX
        print_type_info(uint115_t, get_bits(UINT115_MAX));
    #endif
    #ifdef UINT116_MAX
        print_type_info(uint116_t, get_bits(UINT116_MAX));
    #endif
    #ifdef UINT117_MAX
        print_type_info(uint117_t, get_bits(UINT117_MAX));
    #endif
    #ifdef UINT118_MAX
        print_type_info(uint118_t, get_bits(UINT118_MAX));
    #endif
    #ifdef UINT119_MAX
        print_type_info(uint119_t, get_bits(UINT119_MAX));
    #endif
    #ifdef UINT120_MAX
        print_type_info(uint120_t, get_bits(UINT120_MAX));
    #endif
    #ifdef UINT121_MAX
        print_type_info(uint121_t, get_bits(UINT121_MAX));
    #endif
    #ifdef UINT122_MAX
        print_type_info(uint122_t, get_bits(UINT122_MAX));
    #endif
    #ifdef UINT123_MAX
        print_type_info(uint123_t, get_bits(UINT123_MAX));
    #endif
    #ifdef UINT124_MAX
        print_type_info(uint124_t, get_bits(UINT124_MAX));
    #endif
    #ifdef UINT125_MAX
        print_type_info(uint125_t, get_bits(UINT125_MAX));
    #endif
    #ifdef UINT126_MAX
        print_type_info(uint126_t, get_bits(UINT126_MAX));
    #endif
    #ifdef UINT127_MAX
        print_type_info(uint127_t, get_bits(UINT127_MAX));
    #endif
    #ifdef UINT128_MAX
        print_type_info(uint128_t, get_bits(UINT127_MAX));
    #endif
}
