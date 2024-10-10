package com.sponge.mianshi.mapper;

import com.sponge.mianshi.model.entity.Question;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
* @author SPONGE
* @description 针对表【question(题目)】的数据库操作Mapper
* @Entity com.sponge.mianshi.model.entity.Question
*/
public interface QuestionMapper extends BaseMapper<Question> {
    @Select("select * from question where updateTime >= #{minUpdateTime}")
    List<Question> listQuestionWithDelete(Date minUpdateTime);

}




