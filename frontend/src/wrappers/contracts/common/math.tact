asm fun divc(x: Int, y: Int): Int { DIVC }

fun sqrt(num: Int): Int {
    if (num == 0) {
        return 0;
    }

    let s: Int = log2(num);
    let x: Int = (s == 1 ? (num - 1) / 2 + 1 : 1 << ((s + 1) / 2));

    let q: Int = 0;

    do {
        q = (divc(num, x) - x) / 2;
        x += q;
    } until (q == 0);

    return x;
}
