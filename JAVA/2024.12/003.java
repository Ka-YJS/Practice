/*3. 나이계산하기 -> 빈칸채우기
 - Korea : 현재년도 - 출생년도 +1
 - Year : 현재년도 - 출생년도
 ->출생연도 : year , 2030년도 나이는?
 */

import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        String age_type = sc.next();
        int answer = 0;

        if (age_type.equals("Korea")) {
            answer = (2030-year)+1;
        }
        else if (age_type.equals("Year")) {
            answer = 2030-year;
        }

        System.out.println(answer);
    }
}